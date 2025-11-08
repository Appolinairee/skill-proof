import { useGet } from "@/api/apiHook/useGet";

type SelectOption = {
    id: string;
    name: string;
}

export const useGetSelect = (url: string = "", search: string = "") => {
    const { data = [], isPending = false } = useGet({
        queryKey: ["select", url, search],
        url,
        params: { forSelect: "true", search },
        enabled: Boolean(url),
    }) as {
        data: SelectOption[];
        isPending: boolean;
    };
    
    if (!url) {
        return { options: [], isPending: false };
    }

    const options: Option[] = (data || []).map(item => ({
        id: item.id,
        value: item.id,
        label: item.name,
    }));

    return { 
        options: options || [], 
        isPending: isPending || false 
    };
};
