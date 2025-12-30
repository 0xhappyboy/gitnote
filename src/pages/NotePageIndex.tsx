import React from 'react';
import {
    InputGroup,
    TextArea,
    Button,
    Menu,
    MenuItem,
    Icon,
    Classes,
    Dialog
} from '@blueprintjs/core';
import { themeManager } from '../globals/theme/ThemeManager';

interface NotePageIndexProps {
    children?: React.ReactNode;
}

interface NotePageIndexState {
    theme: 'dark' | 'light';
    notes: Array<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        folderId: string;
    }>;
    folders: Array<{
        id: string;
        name: string;
        parentId: string | null;
    }>;
    activeNoteId: string | null;
    searchQuery: string;
    isDeleteDialogOpen: boolean;
    noteToDelete: string | null;
    expandedFolders: Set<string>;
    leftPanelWidth: number;
    isLeftPanelVisible: boolean;
    isResizing: boolean;
    hoveredFolderId: string | null;
}

class NotePageIndex extends React.Component<NotePageIndexProps, NotePageIndexState> {
    private unsubscribe: (() => void) | null = null;
    private contentRef = React.createRef<HTMLTextAreaElement>();
    private titleRef = React.createRef<HTMLInputElement>();
    private autoSaveInterval: NodeJS.Timeout | null = null;
    private containerRef = React.createRef<HTMLDivElement>();
    private LEFT_MIN_WIDTH = 20;
    private MAX_WIDTH = 50;

    constructor(props: NotePageIndexProps) {
        super(props);
        this.state = {
            theme: themeManager.getTheme(),
            folders: [
                { id: 'folder1', name: 'Personal Notes', parentId: null },
                { id: 'folder2', name: 'Work Projects', parentId: null },
                { id: 'folder3', name: 'Meeting Notes', parentId: null },
                { id: 'folder4', name: 'Technical', parentId: null },
                { id: 'subfolder1', name: 'React', parentId: 'folder4' },
                { id: 'subfolder2', name: 'TypeScript', parentId: 'folder4' },
            ],
            notes: [
                {
                    id: '1',
                    title: 'Welcome to Note App',
                    content: 'This is a note application built with BlueprintJS, featuring modern UI design.\n\nFeatures:\n• Search box on the left for quick note search\n• Title editing area on the right\n• Markdown format support\n• Tag management\n• Auto-save functionality',
                    createdAt: new Date('2024-01-10'),
                    updatedAt: new Date('2024-01-15'),
                    tags: ['Tutorial', 'Important'],
                    folderId: 'folder1'
                },
                {
                    id: '2',
                    title: 'Project Development Plan',
                    content: '# Project Milestones\n\n## Q1\n- [x] Requirements Analysis & Design\n- [x] Core Architecture Setup\n- [ ] UI/UX Optimization\n\n## Q2\n- [ ] Feature Development\n- [ ] Testing Phase\n- [ ] User Feedback Collection',
                    createdAt: new Date('2024-01-12'),
                    updatedAt: new Date('2024-01-14'),
                    tags: ['Project', 'Development'],
                    folderId: 'folder2'
                },
                {
                    id: '3',
                    title: 'Technical Meeting Notes',
                    content: '**Meeting Topic**: Architecture Design Discussion\n**Time**: 2024-01-15 14:00\n**Attendees**: Zhang San (Architect), Li Si (Developer), Wang Wu (Tester)\n\n### Discussion Points\n1. Microservices vs Monolithic Architecture\n2. Database Selection\n3. Caching Strategy\n4. Monitoring & Logging',
                    createdAt: new Date('2024-01-15'),
                    updatedAt: new Date('2024-01-15'),
                    tags: ['Meeting', 'Technical'],
                    folderId: 'folder3'
                },
                {
                    id: '4',
                    title: 'Learning Notes - React Best Practices',
                    content: '## React Hooks Best Practices\n\n### useState\n• For state management\n• Avoid complex state objects\n\n### useEffect\n• Handle side effects\n• Pay attention to dependency array\n\n### useMemo & useCallback\n• Performance optimization\n• Avoid unnecessary re-renders',
                    createdAt: new Date('2024-01-08'),
                    updatedAt: new Date('2024-01-13'),
                    tags: ['Learning', 'React'],
                    folderId: 'subfolder1'
                },
                {
                    id: '5',
                    title: 'TypeScript Advanced Features',
                    content: '## TypeScript Generics\n\n### Basic Usage\n• Type parameterization\n• Constraint types\n\n### Advanced Patterns\n• Conditional types\n• Mapped types\n• Template literal types',
                    createdAt: new Date('2024-01-09'),
                    updatedAt: new Date('2024-01-14'),
                    tags: ['Learning', 'TypeScript'],
                    folderId: 'subfolder2'
                },
                {
                    id: '6',
                    title: 'Weekly Report',
                    content: '## This Week\'s Achievements\n\n### Completed Tasks\n1. User authentication module\n2. Dashboard UI implementation\n3. API integration testing\n\n### Next Week Plans\n1. Performance optimization\n2. Bug fixes\n3. Documentation update',
                    createdAt: new Date('2024-01-16'),
                    updatedAt: new Date('2024-01-16'),
                    tags: ['Report', 'Work'],
                    folderId: 'folder2'
                },
                {
                    id: '7',
                    title: 'Ideas & Brainstorming',
                    content: '## Project Ideas\n\n### Mobile App\n• Health tracking application\n• Language learning platform\n\n### Web Application\n• Collaborative drawing tool\n• Real-time code editor',
                    createdAt: new Date('2024-01-07'),
                    updatedAt: new Date('2024-01-12'),
                    tags: ['Ideas', 'Planning'],
                    folderId: 'folder1'
                }
            ],
            activeNoteId: '1',
            searchQuery: '',
            isDeleteDialogOpen: false,
            noteToDelete: null,
            expandedFolders: new Set(['folder1', 'folder2', 'folder3', 'folder4']),
            leftPanelWidth: this.LEFT_MIN_WIDTH,
            isLeftPanelVisible: true,
            isResizing: false,
            hoveredFolderId: null
        };
    }

    componentDidMount() {
        this.unsubscribe = themeManager.subscribe(this.handleThemeChange);
        this.setupAutoSave();
        this.setupResizeListeners();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.cleanupAutoSave();
        this.cleanupResizeListeners();
    }

    private getMenuItemClassName = (isActive: boolean = false): string => {
        const { theme } = this.state;
        const isDark = theme === 'dark';
        let className = 'custom-menu-item';
        if (isActive) {
            className += ' custom-menu-item-active';
            if (isDark) {
                className += ' custom-menu-item-active-dark';
            } else {
                className += ' custom-menu-item-active-light';
            }
        }
        return className;
    };

    private handleThemeChange = (theme: 'dark' | 'light'): void => {
        this.setState({ theme });
    };

    private setupAutoSave = (): void => {
        this.autoSaveInterval = setInterval(() => {
            this.autoSaveContent();
        }, 30000);
    };

    private cleanupAutoSave = (): void => {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    };

    private autoSaveContent = (): void => {
        const { activeNoteId, notes } = this.state;
        if (!activeNoteId) return;

        const activeNote = notes.find(note => note.id === activeNoteId);
        if (activeNote) {
            console.log('Auto-saving note:', activeNote.title);
        }
    };

    private handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({ searchQuery: e.target.value });
    };

    private handleNoteSelect = (noteId: string): void => {
        this.setState({ activeNoteId: noteId });
    };

    private handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { activeNoteId } = this.state;
        if (!activeNoteId) return;

        this.setState(prevState => ({
            notes: prevState.notes.map(note =>
                note.id === activeNoteId
                    ? { ...note, title: e.target.value, updatedAt: new Date() }
                    : note
            )
        }));
    };

    private handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const { activeNoteId } = this.state;
        if (!activeNoteId) return;

        this.setState(prevState => ({
            notes: prevState.notes.map(note =>
                note.id === activeNoteId
                    ? { ...note, content: e.target.value, updatedAt: new Date() }
                    : note
            )
        }));
    };

    private addNewNote = (): void => {
        const newNote = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: ['Uncategorized'],
            folderId: 'folder1'
        };
        this.setState(prevState => ({
            notes: [newNote, ...prevState.notes],
            activeNoteId: newNote.id
        }));
        setTimeout(() => {
            if (this.titleRef.current) {
                this.titleRef.current.focus();
            }
        }, 100);
    };

    private requestDeleteNote = (noteId: string): void => {
        this.setState({
            isDeleteDialogOpen: true,
            noteToDelete: noteId
        });
    };

    private confirmDeleteNote = (): void => {
        const { noteToDelete } = this.state;
        if (!noteToDelete) return;
        this.setState(prevState => {
            const newNotes = prevState.notes.filter(note => note.id !== noteToDelete);
            const newActiveNoteId = prevState.activeNoteId === noteToDelete
                ? (newNotes.length > 0 ? newNotes[0].id : null)
                : prevState.activeNoteId;
            return {
                notes: newNotes,
                activeNoteId: newActiveNoteId,
                isDeleteDialogOpen: false,
                noteToDelete: null
            };
        });
    };

    private cancelDeleteNote = (): void => {
        this.setState({
            isDeleteDialogOpen: false,
            noteToDelete: null
        });
    };

    private toggleFolder = (folderId: string): void => {
        this.setState(prevState => {
            const newExpandedFolders = new Set(prevState.expandedFolders);
            if (newExpandedFolders.has(folderId)) {
                newExpandedFolders.delete(folderId);
            } else {
                newExpandedFolders.add(folderId);
            }
            return { expandedFolders: newExpandedFolders };
        });
    };

    private toggleLeftPanel = (): void => {
        this.setState(prevState => ({
            isLeftPanelVisible: !prevState.isLeftPanelVisible
        }));
    };

    private formatDate = (date: Date): string => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US');
        }
    };

    private getFoldersByParentId = (parentId: string | null) => {
        return this.state.folders.filter(folder => folder.parentId === parentId);
    };

    private getNotesByFolderId = (folderId: string) => {
        return this.state.notes.filter(note => note.folderId === folderId);
    };

    private setupResizeListeners = (): void => {
        document.addEventListener('mousemove', this.handleResizeMove);
        document.addEventListener('mouseup', this.handleResizeEnd);
    };

    private cleanupResizeListeners = (): void => {
        document.removeEventListener('mousemove', this.handleResizeMove);
        document.removeEventListener('mouseup', this.handleResizeEnd);
    };

    private handleResizeStart = (e: React.MouseEvent): void => {
        e.preventDefault();
        this.setState({ isResizing: true });
    };

    private handleResizeMove = (e: MouseEvent): void => {
        const { isResizing, leftPanelWidth } = this.state;
        if (!isResizing || !this.containerRef.current) return;
        const containerWidth = this.containerRef.current.clientWidth;
        const mouseX = e.clientX;
        const containerLeft = this.containerRef.current.getBoundingClientRect().left;
        let newWidth = ((mouseX - containerLeft) / containerWidth) * 100;
        newWidth = Math.max(this.LEFT_MIN_WIDTH, newWidth);
        newWidth = Math.min(this.MAX_WIDTH, newWidth);
        this.setState({ leftPanelWidth: newWidth });
    };

    private handleResizeEnd = (): void => {
        this.setState({ isResizing: false });
    };

    private handleFolderMouseEnter = (folderId: string): void => {
        this.setState({ hoveredFolderId: folderId });
    };

    private handleFolderMouseLeave = (): void => {
        this.setState({ hoveredFolderId: null });
    };

    private getHoverBackgroundColor = (): string => {
        const { theme } = this.state;
        const isDark = theme === 'dark';
        return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    };

    private getActiveBackgroundColor = (): string => {
        const { theme } = this.state;
        const isDark = theme === 'dark';
        return isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)';
    };

    private handleNoteMouseEnter = (noteId: string): void => {
    };

    private renderFolderTree = (parentId: string | null = null, level: number = 0): React.ReactNode => {
        const { theme, expandedFolders, activeNoteId, hoveredFolderId } = this.state;
        const isDark = theme === 'dark';
        const folders = this.getFoldersByParentId(parentId);
        return folders.map(folder => {
            const childFolders = this.getFoldersByParentId(folder.id);
            const notes = this.getNotesByFolderId(folder.id);
            const isExpanded = expandedFolders.has(folder.id);
            const hasChildren = childFolders.length > 0 || notes.length > 0;
            const isHovered = hoveredFolderId === folder.id;
            return (
                <React.Fragment key={folder.id}>
                    <MenuItem
                        icon={hasChildren ? (isExpanded ? "folder-open" : "folder-close") : "folder-close"}
                        text={
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    position: 'relative'
                                }}
                                onMouseEnter={() => this.handleFolderMouseEnter(folder.id)}
                                onMouseLeave={this.handleFolderMouseLeave}
                            >
                                <span style={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingRight: '24px',
                                    color: isHovered ? (isDark ? '#48AFF0' : '#137CBD') : 'inherit'
                                }}>
                                    {folder.name}
                                </span>
                                {isHovered && (
                                    <Button
                                        icon="plus"
                                        minimal={true}
                                        small={true}
                                        style={{
                                            padding: '2px',
                                            minHeight: '18px',
                                            minWidth: '18px',
                                            opacity: 0.7,
                                            position: 'absolute',
                                            right: '4px',
                                            top: '50%',
                                            transform: 'translateY(-50%)'
                                        }}
                                        title="Add note to this folder"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    />
                                )}
                            </div>
                        }
                        onClick={() => this.toggleFolder(folder.id)}
                        active={false}
                        style={{
                            paddingLeft: `${16 + level * 20}px`,
                            backgroundColor: 'transparent',
                        }}
                    />
                    {isExpanded && (
                        <>
                            {this.renderFolderTree(folder.id, level + 1)}
                            {notes.map(note => {
                                const isNoteActive = note.id === activeNoteId;
                                return (
                                    <MenuItem
                                        key={note.id}
                                        icon="document"
                                        text={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%'
                                                }}
                                                onMouseEnter={(e) => {
                                                    const span = e.currentTarget.querySelector('span');
                                                    if (span) {
                                                        span.style.color = isDark ? '#48AFF0' : '#137CBD';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    const span = e.currentTarget.querySelector('span');
                                                    if (span) {
                                                        span.style.color = isNoteActive ? (isDark ? '#48AFF0' : '#137CBD') : 'inherit';
                                                    }
                                                }}
                                            >
                                                <span style={{
                                                    flex: 1,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '12px',
                                                    fontWeight: isNoteActive ? '600' : '400',
                                                    color: isNoteActive ? (isDark ? '#48AFF0' : '#137CBD') : 'inherit',
                                                    transition: 'color 0.2s ease'
                                                }}>
                                                    {note.title || 'Untitled'}
                                                </span>
                                            </div>
                                        }
                                        onClick={() => this.handleNoteSelect(note.id)}
                                        active={isNoteActive}
                                        style={{
                                            paddingLeft: `${16 + (level + 1) * 20}px`,
                                            backgroundColor: 'transparent',
                                            borderLeft: isNoteActive
                                                ? `3px solid ${isDark ? '#48AFF0' : '#137CBD'}`
                                                : '3px solid transparent',
                                        }}
                                    />
                                );
                            })}
                        </>
                    )}
                </React.Fragment>
            );
        });
    };

    private getFilteredNotes = () => {
        const { notes, searchQuery, theme, activeNoteId } = this.state;
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();
        const isDark = theme === 'dark';
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
        if (filteredNotes.length === 0) {
            return null;
        }
        return filteredNotes.map(note => {
            const isNoteActive = note.id === activeNoteId;
            return (
                <MenuItem
                    key={note.id}
                    icon="document"
                    text={
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                const span = e.currentTarget.querySelector('span');
                                if (span) {
                                    span.style.color = isDark ? '#48AFF0' : '#137CBD';
                                }
                            }}
                            onMouseLeave={(e) => {
                                const span = e.currentTarget.querySelector('span');
                                if (span) {
                                    span.style.color = isNoteActive ? (isDark ? '#48AFF0' : '#137CBD') : 'inherit';
                                }
                            }}
                        >
                            <span style={{
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '12px',
                                fontWeight: isNoteActive ? '600' : '400',
                                color: isNoteActive ? (isDark ? '#48AFF0' : '#137CBD') : 'inherit',
                                transition: 'color 0.2s ease'
                            }}>
                                {note.title || 'Untitled'}
                            </span>
                        </div>
                    }
                    onClick={() => this.handleNoteSelect(note.id)}
                    active={isNoteActive}
                    style={{
                        paddingLeft: '16px',
                        backgroundColor: 'transparent',
                        borderLeft: isNoteActive
                            ? `3px solid ${isDark ? '#48AFF0' : '#137CBD'}`
                            : '3px solid transparent',
                    }}
                />
            );
        });
    };

    private getActiveNote = () => {
        const { notes, activeNoteId } = this.state;
        return notes.find(note => note.id === activeNoteId) || notes[0];
    };

    render() {
        const { theme, searchQuery, isDeleteDialogOpen, leftPanelWidth, isLeftPanelVisible, isResizing } = this.state;
        const activeNote = this.getActiveNote();
        const isDark = theme === 'dark';
        return (
            <div
                ref={this.containerRef}
                className={isDark ? Classes.DARK : ''}
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: isDark ? '#000000' : '#FFFFFF',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: isResizing ? 'col-resize' : 'default'
                }}
            >
                <style>
                    {`
                .left-panel-scroll::-webkit-scrollbar {
                    width: 8px;
                }
                .left-panel-scroll::-webkit-scrollbar-track {
                    background: ${isDark ? '#1A1A1A' : '#F5F5F5'};
                    border-radius: 4px;
                }
                .left-panel-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#555555' : '#CCCCCC'};
                    border-radius: 4px;
                }
                .left-panel-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#666666' : '#BBBBBB'};
                }
                .right-content-scroll::-webkit-scrollbar {
                    width: 8px;
                }
                .right-content-scroll::-webkit-scrollbar-track {
                    background: ${isDark ? '#0A0A0A' : '#F0F0F0'};
                    border-radius: 5px;
                }
                .right-content-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#444444' : '#DDDDDD'};
                    border-radius: 5px;
                    border: 2px solid ${isDark ? '#0A0A0A' : '#F0F0F0'};
                }
                .right-content-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#555555' : '#CCCCCC'};
                }
                .left-panel-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: ${isDark ? '#555555 #1A1A1A' : '#CCCCCC #F5F5F5'};
                }
                .right-content-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: ${isDark ? '#444444 #0A0A0A' : '#DDDDDD #F0F0F0'};
                }
                .custom-menu-item {
                    border-radius: 4px;
                    margin: 2px 4px;
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }
                .custom-menu-item:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                .custom-menu-item-active {
                    border-left: 3px solid #137CBD;
                }
                .custom-menu-item-active-dark {
                    background-color: rgba(72, 175, 240, 0.2);
                }
                .custom-menu-item-active-light {
                    background-color: rgba(19, 124, 189, 0.1);
                }
                .custom-menu-item-active:hover {
                    background-color: rgba(19, 124, 189, 0.15);
                }
                .bp4-dark .custom-menu-item:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .bp4-dark .custom-menu-item-active {
                    border-left: 3px solid #48AFF0;
                }
                .bp4-dark .custom-menu-item-active-dark {
                    background-color: rgba(72, 175, 240, 0.2);
                }
                .bp4-dark .custom-menu-item-active:hover {
                    background-color: rgba(72, 175, 240, 0.3);
                }
                `}
                </style>
                {isLeftPanelVisible && (
                    <>
                        <div
                            style={{
                                width: `${leftPanelWidth}%`,
                                backgroundColor: isDark ? '#000000' : '#FFFFFF',
                                borderRight: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}
                        >
                            <div
                                style={{
                                    padding: '8px 12px',
                                    borderBottom: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                                }}
                            >
                                <InputGroup
                                    leftIcon="search"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    style={{
                                        height: '30px',
                                        backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA',
                                        width: '100%',
                                        border: 'none'
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    padding: '12px',
                                    borderBottom: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                                    flexShrink: 0
                                }}
                            >
                                <Button
                                    icon="plus"
                                    text="New Note"
                                    onClick={this.addNewNote}
                                    fill={true}
                                    intent="primary"
                                    small={true}
                                />
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    padding: '0'
                                }}
                                className="left-panel-scroll"
                            >
                                <Menu
                                    style={{
                                        backgroundColor: 'transparent',
                                        padding: '0',
                                        overflow: 'visible'
                                    }}
                                >
                                    {this.renderFolderTree()}
                                    {this.getFilteredNotes() && (
                                        <div style={{ padding: '4px 0' }}>
                                            <div style={{
                                                padding: '8px 12px',
                                                fontSize: '11px',
                                                color: isDark ? '#8A8A8A' : '#666666',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Search Results
                                            </div>
                                            <Menu style={{ backgroundColor: 'transparent', padding: '0' }}>
                                                {this.getFilteredNotes()}
                                            </Menu>
                                        </div>
                                    )}
                                </Menu>
                            </div>
                            <div
                                style={{
                                    padding: '12px',
                                    borderTop: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                                    fontSize: '12px',
                                    color: isDark ? '#8A8A8A' : '#666666',
                                    textAlign: 'center',
                                    flexShrink: 0
                                }}>
                                {this.state.notes.length} notes
                            </div>
                        </div>
                        <div
                            style={{
                                width: '6px',
                                backgroundColor: 'transparent',
                                cursor: 'col-resize',
                                flexShrink: 0,
                                position: 'relative',
                                zIndex: 10
                            }}
                            onMouseDown={this.handleResizeStart}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '2px',
                                    top: 0,
                                    bottom: 0,
                                    width: '2px',
                                    backgroundColor: isDark ? '#333333' : '#E1E1E1'
                                }}
                            />
                        </div>
                    </>
                )}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        backgroundColor: isDark ? '#000000' : '#FFFFFF',
                        position: 'relative'
                    }}
                    className="right-content-scroll"
                >
                    <div
                        style={{
                            height: '40px',
                            padding: '0 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0,
                            borderBottom: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                            backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5'
                        }}
                    >
                        <Button
                            icon={isLeftPanelVisible ? "menu-closed" : "menu-open"}
                            minimal={true}
                            onClick={this.toggleLeftPanel}
                            small={true}
                            title={isLeftPanelVisible ? "Hide sidebar" : "Show sidebar"}
                        />
                        <Button
                            icon="chevron-left"
                            minimal={true}
                            small={true}
                            title="Previous"
                            onClick={() => console.log('Previous clicked')}
                        />
                        <Button
                            icon="chevron-right"
                            minimal={true}
                            small={true}
                            title="Next"
                            onClick={() => console.log('Next clicked')}
                        />
                        <div style={{
                            height: '16px',
                            width: '1px',
                            backgroundColor: isDark ? '#333333' : '#E1E1E1',
                            margin: '0 8px'
                        }} />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: isDark ? '#8A8A8A' : '#666666',
                            flex: 1,
                            overflow: 'hidden'
                        }}>
                            {(() => {
                                const activeNote = this.getActiveNote();
                                if (!activeNote) return null;
                                const folder = this.state.folders.find(f => f.id === activeNote.folderId);
                                if (!folder) return <span>Unknown folder</span>;
                                const getFolderPath = (folderId: string, path: string[] = []): string[] => {
                                    const currentFolder = this.state.folders.find(f => f.id === folderId);
                                    if (!currentFolder) return path;
                                    const newPath = [currentFolder.name, ...path];
                                    if (currentFolder.parentId) {
                                        return getFolderPath(currentFolder.parentId, newPath);
                                    }
                                    return newPath;
                                };
                                const folderPath = getFolderPath(activeNote.folderId);
                                return (
                                    <>
                                        {folderPath.map((folderName, index) => (
                                            <React.Fragment key={index}>
                                                <span style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {folderName}
                                                </span>
                                                {index < folderPath.length - 1 && (
                                                    <Icon icon="chevron-small-right" iconSize={10} style={{ margin: '0 2px' }} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                        <Icon icon="chevron-right" iconSize={10} style={{ margin: '0 2px' }} />
                                        <span style={{
                                            fontWeight: '600',
                                            color: isDark ? '#E8E8E8' : '#1A1A1A',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {activeNote.title}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                    <div
                        style={{
                            height: '70px',
                            padding: '16px 24px',
                            borderBottom: 'none',
                            alignItems: 'center',
                            flexShrink: 0,
                            cursor: 'text',
                            width: '100%',
                        }}
                        onClick={() => {
                            if (this.titleRef.current) {
                                this.titleRef.current.focus();
                                const input = this.titleRef.current;
                                const length = input.value.length;
                                input.setSelectionRange(length, length);
                            }
                        }}
                    >
                        <InputGroup
                            inputRef={this.titleRef}
                            placeholder="Enter note title..."
                            value={activeNote?.title || ''}
                            onChange={this.handleTitleChange}
                            style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                border: 'none',
                                boxShadow: 'none',
                                backgroundColor: 'transparent',
                                padding: '0',
                                color: isDark ? '#E8E8E8' : '#1A1A1A',
                                flex: 1,
                                cursor: 'text',
                                width: '100%',
                            }}
                            large={true}
                        />
                    </div>
                    <div
                        style={{
                            flex: 1,
                            padding: '0px',
                            overflow: 'auto',
                            backgroundColor: isDark ? '#000000' : '#FFFFFF'
                        }}
                    >
                        <TextArea
                            inputRef={this.contentRef}
                            placeholder="Start typing note content...\nSupports Markdown format"
                            value={activeNote?.content || ''}
                            onChange={this.handleContentChange}
                            style={{
                                paddingLeft: '25px',
                                paddingRight: '25px',
                                width: '100%',
                                height: '100%',
                                minHeight: '400px',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                resize: 'none',
                                color: isDark ? '#CCCCCC' : '#333333'
                            }}
                            fill={true}
                            growVertically={true}
                            className="right-content-scroll"
                        />
                    </div>
                </div>
                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onClose={this.cancelDeleteNote}
                    title="Confirm Deletion"
                    style={{
                        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF'
                    }}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <p style={{ color: isDark ? '#CCCCCC' : '#333333' }}>
                            Are you sure you want to delete this note? This action cannot be undone.
                        </p>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this.cancelDeleteNote}>Cancel</Button>
                            <Button intent="danger" onClick={this.confirmDeleteNote}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default NotePageIndex;