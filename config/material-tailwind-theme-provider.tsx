"use client";

// layout.tsx는 서버단이고 material-tailwind-library는 클라이언트에서 동작해야함으로
// export 설정해서 layout.tsx에서 사용할 수 있도록 설정
export { ThemeProvider } from "@material-tailwind/react";
