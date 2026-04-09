import type { ExplorerFolder } from '../../domain/models';

/**
 * FolderTreeNode is a presentation-layer view model that extends ExplorerFolder
 * with UI-specific state (open/loading/loaded/refresh flags).
 * Keeps domain models free of view concerns (SRP).
 */
export interface FolderTreeNode extends Omit<ExplorerFolder, 'children'> {
  children?: FolderTreeNode[];
  isOpen?: boolean;
  isLoading?: boolean;
  isLoaded?: boolean;
  needsRefresh?: boolean;
}
