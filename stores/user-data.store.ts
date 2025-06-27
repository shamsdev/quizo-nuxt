const userId = ref<number | null>(null);
const avatar = ref<string | null>(null);
const displayName = ref<string | null>(null);

const setData = (data: { UserId: number; UserProfile: { Avatar: string, DisplayName: string } }) => {
    userId.value = data.UserId;
    setProfile(data.UserProfile);
};

const setProfile = (data: { Avatar: string, DisplayName: string }) => {
    avatar.value = data.Avatar;
    displayName.value = data.DisplayName;
};


const clear = () => {
    userId.value = null;
    avatar.value = null;
    displayName.value = null;
};

export const userDataStore = () => ({
    userId: userId.value,
    avatarId: parseInt(avatar.value),
    displayName: displayName.value,
    setData,
    setProfile,
    clear
});