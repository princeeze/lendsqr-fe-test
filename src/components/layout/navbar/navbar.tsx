import logo from "@/assets/images/logo.svg";
import Image from "next/image";
import styles from "./navbar.module.scss";
import { Button } from "@/components/ui/button/button";
import searchIcon from "@/assets/icons/search.svg";
import bellIcon from "@/assets/icons/bell.png";
import chevronDownIcon from "@/assets/icons/chevron-down.svg";
import Link from "next/link";

// simulate fetching user data
const user = {
  name: "Adediji",
  avatar: "/avatar.png",
};

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image src={logo} alt="Lendsqr Logo" fill />
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search" />
        <Button>
          <Image src={searchIcon} alt="Search Icon" />
        </Button>
      </div>
      <div className={styles.menu}>
        <Link
          href="https://docs.lendsqr.com/"
          aria-label="Lendsqr Docs"
          target="_blank"
        >
          Docs
        </Link>

        <button>
          <Image src={bellIcon} alt="Notifications" />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            <Image src={user.avatar} alt="User Avatar" fill />
          </div>
          <button>
            <span>{user.name}</span>
            <Image src={chevronDownIcon} alt="View Options" />
          </button>
        </div>
      </div>
    </nav>
  );
}
