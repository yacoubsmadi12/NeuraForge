
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PartyPopper, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="items-center">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                        <PartyPopper className="w-10 h-10 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-headline">Welcome to NeuraForge!</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground pt-2">
                        We're excited to have you on board. You're all set to start creating with our powerful AI tools.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                    <Button onClick={() => onOpenChange(false)}>
                        <Zap className="mr-2 h-4 w-4" /> Start Creating
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
