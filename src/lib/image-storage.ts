
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';

export interface StoredImage {
    id: string;
    userId: string;
    url: string;
    prompt: string;
    createdAt: number; // Stored as milliseconds
    expiresAt: number; // Stored as milliseconds
}

/**
 * Saves a generated image URL to Firestore with a 7-day TTL.
 * @param userId - The ID of the user who generated the image.
 * @param imageUrl - The data URI of the generated image.
 * @param prompt - The prompt used to generate the image.
 */
export async function saveGeneratedImage(userId: string, imageUrl: string, prompt: string): Promise<void> {
    try {
        const now = Timestamp.now();
        const sevenDaysFromNow = new Timestamp(now.seconds + 7 * 24 * 60 * 60, now.nanoseconds);

        await addDoc(collection(db, 'generatedImages'), {
            userId,
            url: imageUrl,
            prompt,
            createdAt: serverTimestamp(),
            expiresAt: sevenDaysFromNow,
        });
    } catch (error) {
        console.error("Error saving image to Firestore:", error);
        throw new Error("Could not save the generated image.");
    }
}

/**
 * Retrieves all non-expired generated images for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of StoredImage objects.
 */
export async function getGeneratedImages(userId: string): Promise<StoredImage[]> {
    try {
        const now = Timestamp.now();
        const imagesRef = collection(db, 'generatedImages');
        const q = query(
            imagesRef,
            where('userId', '==', userId),
            where('expiresAt', '>', now),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const images: StoredImage[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt as Timestamp | null;
            const expiresAtTimestamp = data.expiresAt as Timestamp;

            // Convert Timestamps to numbers (milliseconds) for serialization
            images.push({
                id: doc.id,
                userId: data.userId,
                url: data.url,
                prompt: data.prompt,
                createdAt: createdAtTimestamp ? createdAtTimestamp.toMillis() : Date.now(),
                expiresAt: expiresAtTimestamp.toMillis(),
            });
        });
        
        return images;
    } catch (error) {
        console.error("Error retrieving images from Firestore:", error);
        return [];
    }
}

/**
 * Deletes a specific generated image from Firestore.
 * @param imageId - The ID of the document to delete.
 */
export async function deleteGeneratedImage(imageId: string): Promise<void> {
    try {
        const imageDocRef = doc(db, 'generatedImages', imageId);
        await deleteDoc(imageDocRef);
    } catch (error) {
        console.error("Error deleting image from Firestore:", error);
        throw new Error("Could not delete the image.");
    }
}
