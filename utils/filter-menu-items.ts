import type { CollapsibleMenuItem, LinkMenuItem, MenuItem } from '@/types/menu';

/**
 * Filters menu items based on authentication status and user roles.
 * Removes protected items when user is not authenticated.
 * Removes items that require specific roles when user doesn't have them.
 * For collapsible items, filters children and removes parent if all children are filtered out.
 */
export function filterMenuItemsByAuth(
  items: MenuItem[],
  isAuthenticated: boolean,
  userRoles?: string[]
): MenuItem[] {
  return items
    .map((item) => {
      // If item is protected and user is not authenticated, filter it out
      if (item.protected && !isAuthenticated) {
        return null;
      }

      // If item requires specific roles and user doesn't have them, filter it out
      if (item.roles && item.roles.length > 0) {
        if (!userRoles || !item.roles.some((role) => userRoles.includes(role))) {
          return null;
        }
      }

      // If it's a collapsible item, filter its children
      if (item.type === 'collapsible') {
        const filteredChildren = filterMenuItemsByAuth(item.children, isAuthenticated, userRoles);
        // If all children are filtered out, remove the parent
        if (filteredChildren.length === 0) {
          return null;
        }
        // Return collapsible item with filtered children
        return {
          ...item,
          children: filteredChildren,
        } as CollapsibleMenuItem;
      }

      // Return link item as is
      return item as LinkMenuItem;
    })
    .filter((item): item is MenuItem => item !== null);
}
