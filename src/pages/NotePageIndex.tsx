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
            isResizing: false
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

    private renderFolderTree = (parentId: string | null = null, level: number = 0): React.ReactNode => {
        const { theme, expandedFolders, activeNoteId } = this.state;
        const isDark = theme === 'dark';
        const folders = this.getFoldersByParentId(parentId);
        return folders.map(folder => {
            const childFolders = this.getFoldersByParentId(folder.id);
            const notes = this.getNotesByFolderId(folder.id);
            const isExpanded = expandedFolders.has(folder.id);
            const hasChildren = childFolders.length > 0 || notes.length > 0;
            return (
                <React.Fragment key={folder.id}>
                    <MenuItem
                        icon={hasChildren ? (isExpanded ? "folder-open" : "folder-close") : "folder-close"}
                        text={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <span style={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {folder.name}
                                </span>
                            </div>
                        }
                        onClick={() => this.toggleFolder(folder.id)}
                        style={{
                            paddingLeft: `${16 + level * 20}px`,
                            backgroundColor: 'transparent'
                        }}
                        active={false}
                    />
                    {isExpanded && (
                        <>
                            {this.renderFolderTree(folder.id, level + 1)}
                            {notes.map(note => (
                                <MenuItem
                                    key={note.id}
                                    icon="document"
                                    text={
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}>
                                            <span style={{
                                                flex: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '12px',
                                                fontWeight: note.id === activeNoteId ? '600' : '400'
                                            }}>
                                                {note.title || 'Untitled'}
                                            </span>
                                        </div>
                                    }
                                    onClick={() => this.handleNoteSelect(note.id)}
                                    active={note.id === activeNoteId}
                                    style={{
                                        paddingLeft: `${16 + (level + 1) * 20}px`,
                                        backgroundColor: note.id === activeNoteId
                                            ? (isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)')
                                            : 'transparent',
                                        borderLeft: note.id === activeNoteId
                                            ? `3px solid ${isDark ? '#48AFF0' : '#137CBD'}`
                                            : '3px solid transparent'
                                    }}
                                />
                            ))}
                        </>
                    )}
                </React.Fragment>
            );
        });
    };

    private getFilteredNotes = () => {
        const { notes, searchQuery } = this.state;
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
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
                                    height: '35px',
                                    padding: '8px 12px',
                                    borderBottom: `1px solid ${isDark ? '#333333' : '#E1E1E1'}`,
                                    flexShrink: 0,
                                    display: 'flex',
                                    gap: '8px'
                                }}
                            >
                                <InputGroup
                                    leftIcon="search"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    style={{
                                        height: '100%',
                                        backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA',
                                        flex: 1
                                    }}
                                    small={true}
                                />
                                <Button
                                    icon="menu"
                                    minimal={true}
                                    onClick={this.toggleLeftPanel}
                                    small={true}
                                    title="Hide sidebar"
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
                            >
                                <Menu
                                    style={{
                                        backgroundColor: 'transparent',
                                        padding: '0',
                                        overflow: 'visible'
                                    }}
                                >
                                    {this.renderFolderTree()}
                                    {this.getFilteredNotes().length === 0 && this.state.searchQuery && (
                                        <div style={{
                                            padding: '40px 20px',
                                            textAlign: 'center',
                                            color: isDark ? '#8A8A8A' : '#666666'
                                        }}>
                                            <Icon
                                                icon="search"
                                                iconSize={40}
                                                style={{ marginBottom: '12px', opacity: 0.5 }}
                                            />
                                            <div style={{ fontSize: '14px' }}>
                                                No matching notes found
                                            </div>
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
                >
                    {!isLeftPanelVisible && (
                        <Button
                            icon="menu"
                            minimal={true}
                            onClick={this.toggleLeftPanel}
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '12px',
                                zIndex: 10
                            }}
                            small={true}
                            title="Show sidebar"
                        />
                    )}
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