"use client";

import { useGetProducts } from "@/api/productServices";
import ProductPreviewCard from "@/components/products/ProductPreviewCard";
import ProfileSectionHeader from "@/components/sidebar/profil/ProfileSectionHeader";
import { ArchiveTickIcon } from "@/public/assets/icons/interactionsIcons";
import useUserStore from "@/store/userStore";

const ProfileFavoritesSection = () => {
  const user = useUserStore((state) => state.user);
  const { products: fetchedFavorites } = useGetProducts({
    limit: "8",
    isFavorites: "true",
  });

  if (!user) return null;

  return (
    <section className="my-4 px-3 xs:my-10">
      <ProfileSectionHeader
        title="Favoris"
        buttonLabel="Tout afficher"
        buttonHref="/favorites"
        icon={<ArchiveTickIcon />}
      />

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none xs:custom-scrollbar">
        {fetchedFavorites?.map((product) => (
          <ProductPreviewCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProfileFavoritesSection;
