const gameGuid = ref(null);
const opponent = ref({
    avatarId: -1,
    displayName: null
})

const setData = (data: { GameGuid: string; Opponent: { UserId: number, Avatar: string, DisplayName: string } }) => {
    gameGuid.value = data.GameGuid;
    setOpponentProfile(data.Opponent);
};

const setOpponentProfile = (data: { Avatar: string, DisplayName: string }) => {
    opponent.value.avatarId = parseInt(data.Avatar);
    opponent.value.displayName = data.DisplayName;
};


const clear = () => {
    gameGuid.value = null;
    opponent.value = null;
};

export const gameStore = () => ({
    gameGuid: gameGuid.value,
    opponent: opponent.value,
    setData,
    clear
});