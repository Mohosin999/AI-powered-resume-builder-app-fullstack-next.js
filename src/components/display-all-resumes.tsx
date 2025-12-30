"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteResume } from "@/actions/resume-actions";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { Resume } from "@/utils/type";
import { Loader } from "lucide-react";
import GoToTop from "./go-to-top";

interface ResumeUpdateProps {
  allResumes: Resume[];
}

const DisplayAllResumes = ({ allResumes }: ResumeUpdateProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handler function to confirms the deletion of a resume
   */
  const handleDelete = async () => {
    setLoading(true);

    try {
      if (deleteId) {
        // 1. Delete resume from DB
        await deleteResume(deleteId);

        // 2. Delete related skills suggestions from localStorage
        const skillsKey = `skills-${deleteId}`;
        localStorage.removeItem(skillsKey);

        // 3. Reset deleteId
        setDeleteId(null);

        // Show toast message
        toast.success("Resume deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allResumes?.map((resume) => (
          <div key={resume.id} className="relative group p-[2px] rounded-2xl">
            <div className="card rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-500 flex flex-col justify-between min-h-[220px] p-6 relative">
              {/* 3-dot menu */}
              <div className="absolute bottom-3 right-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-800 dark:text-gray-100 hover:text-cyan-500 transition active:scale-105 cursor-pointer">
                    <BsThreeDotsVertical size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link
                      href={`/dashboard/${resume.id}/personal-details`}
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link
                      href={`/dashboard/${resume.id}/preview-resume`}
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link
                      href={`/dashboard/${resume.id}/preview-resume`}
                      className="cursor-pointer"
                    >
                      <DropdownMenuItem>Download</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteId(resume.id)}
                      className="cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Resume Title */}
              <div>
                <Link href={`/dashboard/${resume.id}/personal-details`}>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-[#007cb9] dark:group-hover:text-yellow-400 transition-all duration-300 active:scale-105">
                    {resume.title}
                  </h2>
                </Link>
                {/* Animated underline */}
                <div className="h-[3px] w-0 bg-gradient-to-r from-[#007cb9] dark:from-yellow-400 to-green-500 rounded-full mt-2 transition-all duration-500 group-hover:w-full"></div>
              </div>

              {/* Optional small subtitle or info */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                Created:{" "}
                <span className="font-medium">
                  {new Date(resume.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/*=====================================================================
      =           AlertDialog For Deleting (Controlled by deleteId)          =
      =====================================================================*/}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="card">
          <AlertDialogHeader>
            <AlertDialogTitle className="h2">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="paragraph lg:!text-sm">
              This action cannot be undone. This will permanently delete your
              resume.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Buttons */}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteId(null)}
              className="ghost-btn-2nd"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="ghost-btn-3rd">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting
                </div>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*========================= End of AlertDialog =======================*/}

      {/* Go to top button */}
      <GoToTop />
    </>
  );
};

export default DisplayAllResumes;
