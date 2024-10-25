import React, { useState } from "react";
import Markdown from "./markdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  title: string;
  description: string;
  pathname: string;
};

const MarkdownCard = ({ id, title, description, pathname }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const copyContent = () => {
    navigator.clipboard
      .writeText(description)
      .then(() => {
        toast({
          title: "Copied!",
          description:
            "The markdown content has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Copy failed",
          description: "There was an error copying the content.",
          variant: "destructive",
        });
      });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${pathname}/edit/${id}`);
  };

  return (
    <>
      <Card
        className="w-full h-[200px] cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle className="truncate">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <p className="text-sm text-gray-500 line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <div className="prose dark:prose-invert">
              <Markdown content={description} />
            </div>
          </ScrollArea>
          <Button onClick={copyContent} className="mt-4">
            <Copy className="mr-2 h-4 w-4" /> Copy Code
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MarkdownCard;
