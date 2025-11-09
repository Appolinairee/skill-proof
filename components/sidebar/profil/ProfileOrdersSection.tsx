"use client";

import { useGetOrders } from "@/api/orderServices";
import { UserOrderListItem } from "@/components/orders/UserOrdersList";
import ProfileSectionHeader from "@/components/sidebar/profil/ProfileSectionHeader";
import { ShoppingCartIcon } from "@/public/assets/icons/icons";
import useUserStore from "@/store/userStore";

const ProfileOrdersSection = () => {
  const userId = useUserStore((state) => state.userId);
  const { orders: fetchedOrders } = useGetOrders({
    limit: "8",
    userId: userId || "",
  });

  return (
    <section className="my-4 px-3 xs:my-10">
      <ProfileSectionHeader
        title="Commandes"
        buttonLabel="Tout afficher"
        buttonHref="/orders"
        icon={<ShoppingCartIcon />}
      />

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none xs:custom-scrollbar">
        {fetchedOrders?.map((order) => (
          <UserOrderListItem key={order.id} order={order} minified />
        ))}
      </div>
    </section>
  );
};

export default ProfileOrdersSection;
