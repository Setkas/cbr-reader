import {environment} from "../environments/environment";

export const AppVariables: any = {
  apiUrl: "http://localhost:3000",
  defaultColor: "#8ec127",
  imageUrl: "./assets/",
  useLog: !environment.production,
  cookiePrefix: "cbr_",
  replaceString: "$$$"
};
