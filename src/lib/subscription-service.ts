'use server';

import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Subscription, ToolId } from '@/lib/subscription-constants';
import { PLAN_LIMITS } from '@/lib/subscription-constants';

const hasWeekPassed = (lastReset: number) => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return now - lastReset > oneWeek;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
    if (!userId) return null;

    const subRef = doc(db, 'subscriptions', userId);
    const docSnap = await getDoc(subRef);

    if (docSnap.exists()) {
        const subData = docSnap.data() as Omit<Subscription, 'limit'>;
        
        // This is a failsafe for old data that might not have a plan.
        if (!subData.plan) {
            subData.plan = 'Free';
        }
        
        const correctLimit = PLAN_LIMITS[subData.plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.Free;
        
        // التعديل هنا: استخدام toLowerCase() لضمان المطابقة
        if (subData.plan.toLowerCase() === 'free') {
            if (!subData.lastReset || hasWeekPassed(subData.lastReset)) {
                const newSubData: Subscription = {
                    ...subData,
                    limit: correctLimit,
                    usage: {}, // Reset usage
                    lastReset: Date.now(),
                };
                await setDoc(subRef, newSubData, { merge: true });
                return newSubData;
            }
        }
        
        return { ...subData, limit: correctLimit };

    } else {
        const newFreeSub: Subscription = {
            plan: 'Free',
            usage: {},
            limit: PLAN_LIMITS.Free,
            renewalDate: null,
            status: 'trialing',
            lastReset: Date.now(),
        };
        await setDoc(subRef, newFreeSub);
        return newFreeSub;
    }
}

export async function incrementSubscriptionUsage(userId: string, toolId: ToolId): Promise<void> {
    if (!userId) throw new Error("User ID is required");

    const subRef = doc(db, 'subscriptions', userId);
    
    const sub = await getSubscription(userId);
    if (!sub) throw new Error("Subscription not found");
    
    const currentUsage = sub.usage[toolId] || 0;
    if (sub.limit !== Infinity && currentUsage >= sub.limit) {
        throw new Error("Usage limit reached");
    }

    await updateDoc(subRef, {
        [`usage.${toolId}`]: increment(1)
    });
}
