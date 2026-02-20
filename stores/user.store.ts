const userId = ref<number | null>(null);
const avatarId = ref<number | null>(null);
const displayName = ref<string | null>(null);
const coins = ref<number>(0);
const energy = ref<number>(0);
const energyNextAt = ref<string | null>(null);

const setData = (data: { UserId: number; UserProfile: { Avatar: string; DisplayName: string } }) => {
    userId.value = data.UserId;
    setProfile(data.UserProfile);
};

const setProfile = (data: { Avatar: string; DisplayName: string }) => {
    avatarId.value = parseInt(data.Avatar);
    displayName.value = data.DisplayName;
};

const setHomeData = (data: {
    UserResource: { Xp: number; Coin: number };
    UserEnergy: { Amount: number; NextGenerationAt?: string };
}) => {
    coins.value = data.UserResource.Coin;
    energy.value = data.UserEnergy.Amount;
    energyNextAt.value = data.UserEnergy.NextGenerationAt ?? null;
};

const clear = () => {
    userId.value = null;
    avatarId.value = null;
    displayName.value = null;
    coins.value = 0;
    energy.value = 0;
    energyNextAt.value = null;
};

export const userStore = () => ({
    userId: userId.value,
    avatarId: avatarId.value,
    displayName: displayName.value,
    coins: coins.value,
    energy: energy.value,
    energyNextAt: energyNextAt.value,
    setData,
    setProfile,
    setHomeData,
    clear
});