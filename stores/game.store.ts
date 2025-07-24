const gameGuid = ref<string | null>(null);
const opponent = ref<any | null>({
    userId: null,
    avatarId: null,
    displayName: null
});
const maxRounds = ref<number | null>(null);
const questionTime = ref<number | null>(null);

const setData = (data: {
    QuestionTime: number,
    MaxRounds: number,
    GameGuid: string;
    Opponent: { UserId: number; UserProfile: { Avatar: string, DisplayName: string } }
}) => {
    gameGuid.value = data.GameGuid;
    questionTime.value = data.QuestionTime;
    maxRounds.value = data.MaxRounds;
    setOpponentProfile(data.Opponent);
};

const setOpponentProfile = (data: { UserId: number; UserProfile: { Avatar: string, DisplayName: string } }) => {
    opponent.value.userId = data.UserId;
    opponent.value.avatarId = parseInt(data.UserProfile.Avatar);
    opponent.value.displayName = data.UserProfile.DisplayName;
};


const clear = () => {
    gameGuid.value = null;
    questionTime.value = null;
    maxRounds.value = null;

    opponent.value = null;
};

export const gameStore = () => ({
    gameGuid: gameGuid.value,
    maxRounds,
    questionTime,
    opponent: opponent.value,
    setData,
    clear
});