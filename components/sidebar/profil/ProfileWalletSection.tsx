"use client";

import React from "react";
import WalletSummaryBar from "@/components/wallet/WalletSummaryBar";
import ButtonLoading from "@/components/base/button/ButtonLoading";
import { useGetStatistics } from "@/api/paymentServices";
import ProfileSectionHeader from "@/components/sidebar/profil/ProfileSectionHeader";
import { WalletAddIcon } from "@/public/assets/icons/SideBarIcons";
import { getWalletStatisticsData } from "@/components/wallet/Wallet";

const ProfileWalletSection = () => {
  const { data: statistics, isPending } = useGetStatistics();

  if (isPending) return <ButtonLoading />;

  const statisticsData = getWalletStatisticsData(statistics);

  return (
    <section className="my-4 px-3 xs:my-10">
      <ProfileSectionHeader
        title="Portefeuille"
        buttonLabel="Gérer mon portefeuille"
        buttonHref="/wallet"
        icon={<WalletAddIcon />}
      />

      <WalletSummaryBar
        statistics={statisticsData || []}
        isLoading={isPending}
        resume={true}
        activityThreshold={100}
        className="!mt-0"
      />
    </section>
  );
};

export default ProfileWalletSection;
