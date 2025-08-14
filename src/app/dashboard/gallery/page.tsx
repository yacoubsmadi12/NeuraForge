
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { getGeneratedImages, deleteGeneratedImage, type StoredImage } from '@/lib/image-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function GalleryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [images, setImages] = useState<StoredImage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userImages = await getGeneratedImages(user.uid);
            setImages(userImages);
        } catch (error) {
            console.error("Failed to fetch images:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your gallery. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchImages();
        }
    }, [user, authLoading, router, fetchImages]);

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "generated-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (imageId: string) => {
        try {
            await deleteGeneratedImage(imageId);
            setImages(prevImages => prevImages.filter(img => img.id !== imageId));
            toast({
                title: "Image Deleted",
                description: "The image has been successfully removed from your gallery.",
            });
        } catch (error) {
            console.error("Error deleting image:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete the image. Please try again.",
            });
        }
    };
    
    if (authLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
         <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline">Image Gallery</CardTitle>
                <CardDescription>View your generated images. They are stored for 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                     <div className="flex-1 flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <Card key={image.id} className="group relative overflow-hidden aspect-square">
                                <NextImage
                                    src={image.url}
                                    alt={image.prompt}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                     <p className="text-white text-xs mb-2 truncate">{image.prompt}</p>
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="outline" onClick={() => handleDownload(image.url)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the image from your gallery.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(image.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-card rounded-lg border p-12">
                        <ImageIcon className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold">Your Gallery is Empty</h3>
                        <p className="mt-2">Start creating images with our tools, and they will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
