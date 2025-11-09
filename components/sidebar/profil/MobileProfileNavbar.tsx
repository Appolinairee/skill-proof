import MobileSearch from "@/components/search/MobileSearch";
import BackButton from "@/components/base/BackButton";
import NotificationLink from "@/components/notification/NotificationLink";

export default function MobileProfileNavbar() {
  return (
    <div>
      <div className="xs:hidden flex items-center justify-between gap-2 px-4 py-[10px] border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <BackButton className="!p-0 shadow-none *:text-black/80" />
          <span className="font-medium flex-1 text-[18px]">Profil</span>
        </div>

        <div className="flex items-center gap-7">
          <NotificationLink />
          <MobileSearch />
        </div>
      </div>
    </div>
  );
}
