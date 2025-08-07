import { atom } from "recoil";

export const isDarkAtom = atom({
    key: "isDark",
    default: false,
})

export const isTitleAtom = atom({
    key: "title",
    default: "Coins",
})