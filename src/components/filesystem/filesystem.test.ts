import { beforeEach, describe, expect, it, vi } from 'vitest';
import './filesystem.js';
import type { TpFilesystem } from './filesystem.js';

function render(): TpFilesystem {
  const element = document.createElement('tp-filesystem') as TpFilesystem;
  document.body.append(element);
  return element;
}

function request(tree: Element, name: string, detail: unknown): void {
  tree.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

describe('<tp-filesystem>', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('stores cloned, normalized files and exposes state', () => {
    const element = render();
    const files = [{ path: 'src\\main.ts', content: 'one', language: 'ts' }];
    element.setFiles(files);
    files[0]!.content = 'changed';
    expect(element.readFile('/src/main.ts')).toBe('one');
    const copy = element.getFiles();
    copy[0]!.content = 'copy';
    expect(element.readFile('/src/main.ts')).toBe('one');
    expect(element.querySelector('[data-node-id="/src/main.ts"]')).not.toBeNull();
  });

  it('writes, adds and deletes mutable files while protecting readonly files', () => {
    const element = render();
    element.setFiles([
      { path: '/a.txt', content: 'a' },
      { path: '/locked.txt', content: 'x', readonly: true },
    ]);
    const write = vi.fn();
    const add = vi.fn();
    const remove = vi.fn();
    element.addEventListener('tp-filesystem-write', write);
    element.addEventListener('tp-filesystem-add', add);
    element.addEventListener('tp-filesystem-delete', remove);
    element.writeFile('a.txt', 'b');
    element.writeFile('/locked.txt', 'y');
    element.writeFile('/missing.txt', 'y');
    element.addFile({ path: 'new.txt', content: '' });
    element.addFile({ path: '/new.txt', content: 'duplicate' });
    element.deleteFile('/locked.txt');
    element.deleteFile('/missing.txt');
    element.deleteFile('/new.txt');
    expect(element.readFile('/a.txt')).toBe('b');
    expect(element.readFile('/locked.txt')).toBe('x');
    expect(write).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  it('renames, moves, opens, closes and activates files', () => {
    const element = render();
    element.setFiles([{ path: '/a.txt', content: '' }, { path: '/b.txt', content: '' }]);
    element.openFile('/a.txt');
    element.setDirtyPaths(['/a.txt', '/missing.txt']);
    element.renameFile('/a.txt', '/c.txt');
    element.renameFile('/c.txt', '/c.txt');
    expect(element.getState()).toMatchObject({ activePath: '/c.txt', openPaths: ['/c.txt'] });
    expect(element.getDirtyPaths().sort()).toEqual(['/c.txt', '/missing.txt']);
    element.moveFile('/c.txt', '/folder/c.txt');
    expect(element.getActivePath()).toBe('/folder/c.txt');
    element.setActivePath('/b.txt', false);
    element.closeFile('/b.txt');
    element.setActivePath(null);
    element.openFile('/missing.txt');
    element.renameFile('/b.txt', '/folder/c.txt');
    element.renameFile('/missing.txt', '/x.txt');
    expect(element.getActivePath()).toBeNull();
  });

  it('prunes invalid state when replacing the full state', () => {
    const element = render();
    element.setState({ files: [{ path: '/', content: '' }], activePath: '/missing', openPaths: ['/missing'], dirtyPaths: ['/missing'] });
    expect(element.getState()).toEqual({ files: [{ path: '/untitled.txt', content: '', language: undefined, readonly: undefined }], activePath: null, openPaths: [], dirtyPaths: [] });
    expect(element.getDirtyPaths()).toEqual([]);
  });

  it('handles requests emitted by its file tree', () => {
    const element = render();
    element.setFiles([{ path: '/src/a.txt', content: '' }, { path: '/root.txt', content: '' }]);
    const tree = element.querySelector('tp-file-tree')!;
    request(tree, 'tp-file-tree-open', { path: '/root.txt' });
    request(tree, 'tp-file-tree-active', { path: '/src/a.txt' });
    vi.spyOn(window, 'prompt').mockReturnValueOnce('new.txt').mockReturnValueOnce('folder').mockReturnValueOnce('').mockReturnValueOnce(null);
    request(tree, 'tp-file-tree-add-request', { path: '/src', kind: 'file' });
    request(tree, 'tp-file-tree-add-request', { path: null, kind: 'directory' });
    request(tree, 'tp-file-tree-add-request', { path: null, kind: 'file' });
    request(tree, 'tp-file-tree-add-request', { path: null, kind: 'file' });
    request(tree, 'tp-file-tree-rename-request', { path: '/src', newName: 'lib' });
    request(tree, 'tp-file-tree-move-request', { sourcePath: '/root.txt', destinationPath: '/lib', position: 'inside' });
    request(tree, 'tp-file-tree-move-request', { sourcePath: '/lib/root.txt', destinationPath: '/lib/a.txt', position: 'before' });
    request(tree, 'tp-file-tree-delete-request', { path: '/lib/new.txt' });
    expect(element.getFiles().map((file) => file.path).sort()).toEqual(['/folder/.gitkeep', '/lib/a.txt', '/lib/root.txt']);
  });
});
