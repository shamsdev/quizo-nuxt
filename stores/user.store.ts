const userId = ref<number | null>(null);
const avatarId = ref<number | null>(null);
const displayName = ref<string | null>(null);

const setData = (data: { UserId: number; UserProfile: { Avatar: string, DisplayName: string } }) => {
    userId.value = data.UserId;
    setProfile(data.UserProfile);
};

const setProfile = (data: { Avatar: string, DisplayName: string }) => {
    avatarId.value = parseInt(data.Avatar);
    displayName.value = data.DisplayName;
};


const clear = () => {
    userId.value = null;
    avatarId.value = null;
    displayName.value = null;
};

export const userStore = () => ({
    userId: userId.value,
    avatarId: avatarId.value,
    displayName: displayName.value,
    setData,
    setProfile,
    clear
});