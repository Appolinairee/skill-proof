"use client";

import Image from "next/image";
import useUserStore from "@/store/userStore";
import ProfileForm from "./ProfileForm";
import Modal from "@/components/base/modal/Modal";
import React, { useState } from "react";
import Button from "@/components/base/button/Button";
import { formatMediaUrl } from "@/utils/media";
import { EditIcon } from "@/components/base/table/TableIcons";
import { MailIcon, PhoneIcon } from "@/public/assets/icons/icons";
import { cn } from "@/utils/utils";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <>
      <div
        className={cn(
          "rounded-3xl px-3 sm:px-0 py-1 sm:py-0 shadow-xs flex items-center justify-between !flex-wrap gap-y-4 xs:pb-8 mb-8"
        )}
      >
        <div className="flex-c gap-6">
          <div className="relative w-20 h-20">
            <Image
              src={
                user?.profilePicture
                  ? formatMediaUrl(user.profilePicture?.url)
                  : "/assets/default-profile.jpeg"
              }
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex-1 justify-start items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>

            <div className="flex items-center space-x-2 mt-1 mb-[2px]">
              <MailIcon className="w-4 h-4 text-gray-600" />
              <span>{user.email}</span>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-gray-600" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        <Button
          icon={<EditIcon className="w-5 h-5" />}
          onClick={() => setIsEditing(true)}
          className="primary-btn !w-fit"
        >
          Modifier
        </Button>
      </div>

      <Modal
        isActive={isEditing}
        setIsActive={setIsEditing}
        className="!w-[95%] !max-w-[450px]"
      >
        <ProfileForm setIsEditing={setIsEditing} />
      </Modal>
    </>
  );
};

export default Profile;
