import localFont from "next/font/local";

export const cookieRun = localFont({
  src: [
    {
      path: "../../public/CookieRunRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/CookieRunBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/CookieRunBlack.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const ongl = localFont({
  src: "../../public/ongl.ttf",
  weight: "400",
  style: "normal",
});
