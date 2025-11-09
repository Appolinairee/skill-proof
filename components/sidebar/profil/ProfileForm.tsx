import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/base/form/InputField";
import Button from "@/components/base/button/Button";
import ImageUploadField from "@/components/base/form/ImageUploadField";
import GeneralError from "@/components/base/form/GeneralError";
import { getFieldError } from "@/utils/apiUtils";
import PhoneNumberField from "@/components/base/form/PhoneNumberField";
import { updateUserValidations } from "@/validations/authValidations";
import { useUpdateUser } from "@/api/userServices";
import useUserStore from "@/store/userStore";
import { getUserLocaleData } from "@/utils/utils";

const ProfileForm = ({ setIsEditing }: { setIsEditing: SetState }) => {
  const [serverErrors, setServerErrors] = useState({});
  const user = useUserStore((state) => state.user);
  const { updateUser, isPending } = useUpdateUser(
    setServerErrors,
    setIsEditing
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(updateUserValidations),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      profilePicture: user?.profilePicture || null,
    },
  });

  const onSubmit = (data: any) => {
    const userLocaleData = getUserLocaleData();
    updateUser(user, { ...data, ...userLocaleData });
  };

  return (
    <form
      className="flex flex-col gap-1 mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <GeneralError serverErrors={serverErrors} />

      <div className="flex gap-3">
        <InputField
          name="lastName"
          type="text"
          label="Nom"
          placeholder="Nom ici"
          errorMessage={getFieldError("lastName", errors, serverErrors)}
          register={register}
          required
        />

        <InputField
          name="firstName"
          type="text"
          label="Prénom"
          placeholder="Prénom ici"
          errorMessage={getFieldError("firstName", errors, serverErrors)}
          register={register}
          required
        />
      </div>

      <Controller
        name="profilePicture"
        control={control}
        render={({ field: { value, onChange, ref } }) => (
          <ImageUploadField
            label="Photo de profile"
            name="profilePicture"
            errorMessage={getFieldError("profilePicture", errors, serverErrors)}
            onChange={onChange}
            value={value}
            ref={ref}
          />
        )}
      />

      <Controller
        name="phoneNumber"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <PhoneNumberField
            label="Numéro de téléphone"
            placeholder="99 99 99 99"
            value={value}
            onChange={onChange}
            ref={ref}
            name="phoneNumber"
            errorMessage={getFieldError("phoneNumber", errors, serverErrors)}
            required
          />
        )}
      />

      <div className="flex gap-4 mt-6">
        <Button
          onClick={() => setIsEditing(false)}
          className="border-btn !w-[25%] "
        >
          Annuler
        </Button>

        <Button
          type="submit"
          className="primary-btn shadow-soft !w-[75%]"
          disabled={!isDirty || Object.keys(errors).length > 0}
          isLoading={isPending}
        >
          Modifier
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
