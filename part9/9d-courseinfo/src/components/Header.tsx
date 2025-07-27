// part9/9d-courseinfo/src/components/Header.tsx

import { HeaderProps } from "../types";

const Header = (props: HeaderProps) => {
  return <h1>{props.courseName}</h1>;
};

export default Header;
