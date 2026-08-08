import { MENU_ITEMS }
  from "@/config/menuConfig";

import usePermission
  from "@/hooks/usePermission";

import { Link }
  from "react-router-dom";

export default function Sidebar() {

  const { can } = usePermission();

  const menus = MENU_ITEMS.filter(
    item => can(item.permission)
  );

  return (
    <div>
      {menus.map(menu => (
        <Link
          key={menu.path}
          to={menu.path}
        >
          {menu.title}
        </Link>
      ))}
    </div>
  );
}