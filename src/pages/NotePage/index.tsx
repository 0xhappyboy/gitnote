import React from 'react';
import {
    InputGroup,
    TextArea,
    Button,
    Menu,
    MenuItem,
    Icon,
    Classes,
    Dialog,
} from '@blueprintjs/core';
import { themeManager } from '../../globals/theme/ThemeManager';
import { TextFormatUtils } from './TextFormatUtils';
import TextToolbar from './TextToolbar';
import { setupThemeChangeListener } from '../../globals/events/SystemEvents';

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
    hoveredLineNumber: number | null;
    visibleLineButtons: Set<number>;
    isDragging: boolean;
    dragStartY: number;
    dragLineNumber: number | null;
    dragIndicatorPosition: number | null;
    isFormatMenuOpen: boolean;
    isTableGridOpen: boolean;
    tableGridPosition: { x: number; y: number } | null;
    tableHoveredRows: number;
    tableHoveredCols: number;
    tableSelectedRows: number;
    tableSelectedCols: number;
    isSelectingTable: boolean;

    isTextToolbarOpen: boolean;
    textToolbarPosition: { x: number; y: number } | null;
    editorRect: DOMRect | null;
    selectedTextRange: { start: number; end: number } | null;
    selectedText: string;
    textToolbarType: string;
    textToolbarBold: boolean;
    textToolbarItalic: boolean;
    textToolbarUnderline: boolean;
    textToolbarStrikethrough: boolean;
    textToolbarFontColor: string;
    textToolbarBgColor: string;
    textToolbarFontFamily: string;
    textToolbarFontSize: string;
    textToolbarAlignment: string;
    isLinkDialogOpen: boolean;
    linkUrl: string;
    linkText: string;
}

class NotePageIndex extends React.Component<NotePageIndexProps, NotePageIndexState> {
    private unsubscribe: (() => void) | null = null;
    private contentRef = React.createRef<HTMLTextAreaElement>();
    private titleRef = React.createRef<HTMLInputElement>();
    private autoSaveInterval: NodeJS.Timeout | null = null;
    private containerRef = React.createRef<HTMLDivElement>();
    private textAreaContainerRef = React.createRef<HTMLDivElement>();
    private LEFT_MIN_WIDTH = 20;
    private MAX_WIDTH = 50;
    private LINE_HEIGHT = 22;
    private DRAG_THRESHOLD = 5;
    private tableGridRef = React.createRef<HTMLDivElement>();
    private TABLE_CELL_SIZE = 24;
    private TABLE_GRID_PADDING = 8;
    private TABLE_MAX_ROWS = 8;
    private TABLE_MAX_COLS = 8;
    private themeUnlisten: (() => void) | null = null;

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
            hoveredFolderId: null,
            hoveredLineNumber: null,
            visibleLineButtons: new Set<number>(),
            isDragging: false,
            dragStartY: 0,
            dragLineNumber: null,
            dragIndicatorPosition: null,
            isFormatMenuOpen: false,
            isTableGridOpen: false,
            tableGridPosition: null,
            tableHoveredRows: 0,
            tableHoveredCols: 0,
            tableSelectedRows: 0,
            tableSelectedCols: 0,
            isSelectingTable: false,
            isTextToolbarOpen: false,
            textToolbarPosition: null,
            editorRect: null,
            selectedTextRange: null,
            selectedText: '',
            textToolbarType: 'normal',
            textToolbarBold: false,
            textToolbarItalic: false,
            textToolbarUnderline: false,
            textToolbarStrikethrough: false,
            textToolbarFontColor: '#000000',
            textToolbarBgColor: 'transparent',
            textToolbarFontFamily: 'default',
            textToolbarFontSize: '14px',
            textToolbarAlignment: 'left',
            isLinkDialogOpen: false,
            linkUrl: '',
            linkText: ''
        };
    }

    componentDidMount() {
        this.unsubscribe = themeManager.subscribe(this.handleThemeChange);
        this.setupAutoSave();
        this.setupResizeListeners();
        this.setupDragListeners();
        this.setupTextSelectionListener();
        document.addEventListener('click', this.handleGlobalClick);
        document.addEventListener('scroll', this.handleScroll);
        this.themeUnlisten = setupThemeChangeListener((theme: string, isDark: any) => {
            this.handleThemeChange(theme as 'dark' | 'light');
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.cleanupAutoSave();
        this.cleanupResizeListeners();
        this.cleanupDragListeners();
        this.cleanupTextSelectionListener();
        document.removeEventListener('click', this.handleGlobalClick);
        document.removeEventListener('scroll', this.handleScroll);
        if (this.themeUnlisten) {
            this.themeUnlisten();
        }
    }

    private handleScroll = (): void => {
        const { isTextToolbarOpen } = this.state;
        if (isTextToolbarOpen) {
            this.setState({
                isTextToolbarOpen: false,
                textToolbarPosition: null
            });
        }
    };

    private handleTextTypeChange = (type: string): void => {
        this.setState({ textToolbarType: type });
    };

    private handleBoldToggle = (): void => {
        this.setState(prevState => ({ textToolbarBold: !prevState.textToolbarBold }));
    };

    private handleItalicToggle = (): void => {
        this.setState(prevState => ({ textToolbarItalic: !prevState.textToolbarItalic }));
    };

    private handleUnderlineToggle = (): void => {
        this.setState(prevState => ({ textToolbarUnderline: !prevState.textToolbarUnderline }));
    };

    private handleStrikethroughToggle = (): void => {
        this.setState(prevState => ({ textToolbarStrikethrough: !prevState.textToolbarStrikethrough }));
    };

    private handleFontColorChange = (color: string): void => {
        this.setState({ textToolbarFontColor: color });
    };

    private handleBgColorChange = (color: string): void => {
        this.setState({ textToolbarBgColor: color });
    };

    private handleFontFamilyChange = (fontFamily: string): void => {
        this.setState({ textToolbarFontFamily: fontFamily });
    };

    private handleFontSizeChange = (fontSize: string): void => {
        this.setState({ textToolbarFontSize: fontSize });
    };

    private handleAlignmentChange = (alignment: string): void => {
        this.setState({ textToolbarAlignment: alignment });
    };

    private handleLinkDialogOpen = (): void => {
        this.setState({ isLinkDialogOpen: true });
    };

    private handleLinkDialogClose = (): void => {
        this.setState({ isLinkDialogOpen: false });
    };

    private handleLinkUrlChange = (url: string): void => {
        this.setState({ linkUrl: url });
    };

    private handleLinkApply = (): void => {
        const { activeNoteId, notes, selectedTextRange, linkUrl, selectedText } = this.state;
        if (!activeNoteId || !selectedTextRange || !linkUrl.trim()) return;
        const activeNoteIndex = notes.findIndex(note => note.id === activeNoteId);
        if (activeNoteIndex === -1) return;
        const activeNote = notes[activeNoteIndex];
        const formattedContent = TextFormatUtils.applyLink(
            activeNote.content,
            selectedTextRange.start,
            selectedTextRange.end,
            linkUrl
        );
        this.setState(prevState => ({
            notes: prevState.notes.map((note, index) =>
                index === activeNoteIndex
                    ? {
                        ...note,
                        content: formattedContent,
                        updatedAt: new Date()
                    }
                    : note
            ),
            isLinkDialogOpen: false,
            linkUrl: '',
            isTextToolbarOpen: false,
            textToolbarPosition: null
        }));
        setTimeout(() => {
            if (this.contentRef.current) {
                const newCursorPos = selectedTextRange.start + selectedText.length + linkUrl.length + 4;
                this.contentRef.current.focus();
                this.contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 10);
    };

    private handleFormatApply = (): void => {
        const {
            activeNoteId,
            notes,
            selectedTextRange,
            textToolbarType,
            textToolbarBold,
            textToolbarItalic,
            textToolbarUnderline,
            textToolbarStrikethrough,
            textToolbarFontColor,
            textToolbarBgColor,
            textToolbarFontFamily,
            textToolbarFontSize,
            textToolbarAlignment,
            selectedText
        } = this.state;
        if (!activeNoteId || !selectedTextRange) return;
        const activeNoteIndex = notes.findIndex(note => note.id === activeNoteId);
        if (activeNoteIndex === -1) return;
        const activeNote = notes[activeNoteIndex];
        const formattedContent = TextFormatUtils.applyTextFormat(
            activeNote.content,
            selectedTextRange.start,
            selectedTextRange.end,
            {
                type: textToolbarType,
                bold: textToolbarBold,
                italic: textToolbarItalic,
                underline: textToolbarUnderline,
                strikethrough: textToolbarStrikethrough,
                fontColor: textToolbarFontColor,
                bgColor: textToolbarBgColor,
                fontFamily: textToolbarFontFamily,
                fontSize: textToolbarFontSize,
                alignment: textToolbarAlignment
            }
        );
        this.setState(prevState => ({
            notes: prevState.notes.map((note, index) =>
                index === activeNoteIndex
                    ? {
                        ...note,
                        content: formattedContent,
                        updatedAt: new Date()
                    }
                    : note
            ),
            isTextToolbarOpen: false,
            textToolbarPosition: null
        }));
        setTimeout(() => {
            if (this.contentRef.current) {
                let newLength = selectedText.length;
                if (textToolbarType === 'h1') newLength += 2;
                else if (textToolbarType === 'h2') newLength += 3;
                else if (textToolbarType === 'h3') newLength += 4;
                else if (textToolbarType === 'ul' || textToolbarType === 'ol' || textToolbarType === 'blockquote') newLength += 2;
                else if (textToolbarType === 'inline-code') newLength += 2;
                if (textToolbarBold) newLength += 4;
                if (textToolbarItalic) newLength += 2;
                if (textToolbarStrikethrough) newLength += 4;
                if (textToolbarUnderline) newLength += 7;
                const newCursorPos = selectedTextRange.start + newLength;
                this.contentRef.current.focus();
                this.contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 10);
    };

    private setupTextSelectionListener = (): void => {
        if (this.contentRef.current) {
            this.contentRef.current.addEventListener('mouseup', this.handleTextSelection);
            this.contentRef.current.addEventListener('select', this.handleTextSelection);
            this.contentRef.current.addEventListener('keyup', this.handleTextSelection);
        }
    };

    private cleanupTextSelectionListener = (): void => {
        if (this.contentRef.current) {
            this.contentRef.current.removeEventListener('mouseup', this.handleTextSelection);
            this.contentRef.current.removeEventListener('select', this.handleTextSelection);
            this.contentRef.current.removeEventListener('keyup', this.handleTextSelection);
        }
    };

    private handleTextSelection = (): void => {
        if (!this.contentRef.current) return;
        const textArea = this.contentRef.current;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        if (start !== end) {
            const selectedText = textArea.value.substring(start, end);
            const format = TextFormatUtils.detectFormatAtPosition(textArea.value, start);
            const editorRect = textArea.getBoundingClientRect();
            let x = editorRect.left + editorRect.width / 2;
            let y = editorRect.top + editorRect.height / 2;
            try {
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'fixed';
                tempDiv.style.left = '-1000px';
                tempDiv.style.top = '-1000px';
                tempDiv.style.whiteSpace = 'pre-wrap';
                tempDiv.style.fontSize = window.getComputedStyle(textArea).fontSize;
                tempDiv.style.fontFamily = window.getComputedStyle(textArea).fontFamily;
                tempDiv.style.lineHeight = window.getComputedStyle(textArea).lineHeight;
                tempDiv.style.width = editorRect.width + 'px';
                const lines = textArea.value.split('\n');
                const startLine = textArea.value.substring(0, start).split('\n').length - 1;
                const endLine = textArea.value.substring(0, end).split('\n').length - 1;
                let htmlContent = '';
                for (let i = 0; i < lines.length; i++) {
                    if (i === startLine && i === endLine) {
                        const line = lines[i];
                        const lineStart = textArea.value.substring(0, start).split('\n').pop()?.length || 0;
                        const lineEnd = lineStart + (end - start);
                        htmlContent += line.substring(0, lineStart) +
                            '<span id="selected-text">' +
                            line.substring(lineStart, lineEnd) +
                            '</span>' +
                            line.substring(lineEnd);
                    } else if (i === startLine) {
                        const line = lines[i];
                        const lineStart = textArea.value.substring(0, start).split('\n').pop()?.length || 0;
                        htmlContent += line.substring(0, lineStart) +
                            '<span id="selected-text">' +
                            line.substring(lineStart) +
                            '</span>';
                    } else if (i > startLine && i < endLine) {
                        htmlContent += '<span id="selected-text">' + lines[i] + '</span>';
                    } else if (i === endLine) {
                        const line = lines[i];
                        const lineEnd = textArea.value.substring(0, end).split('\n').pop()?.length || 0;
                        htmlContent += '<span id="selected-text">' +
                            line.substring(0, lineEnd) +
                            '</span>' +
                            line.substring(lineEnd);
                    } else {
                        htmlContent += lines[i];
                    }
                    if (i < lines.length - 1) {
                        htmlContent += '<br>';
                    }
                }
                tempDiv.innerHTML = htmlContent;
                document.body.appendChild(tempDiv);
                const selectedElement = tempDiv.querySelector('#selected-text');
                if (selectedElement) {
                    const selectedRect = selectedElement.getBoundingClientRect();
                    x = selectedRect.left + selectedRect.width / 2;
                    y = selectedRect.bottom;
                }
                document.body.removeChild(tempDiv);

            } catch (error) {
                console.error('获取选中文本位置失败:', error);
                const lines = textArea.value.substring(0, start).split('\n');
                const lineNumber = lines.length;
                const lineHeight = this.LINE_HEIGHT;
                const relativeY = (lineNumber * lineHeight) + textArea.scrollTop;
                const relativeX = editorRect.width / 2;
                x = editorRect.left + relativeX;
                y = editorRect.top + relativeY + lineHeight;
            }
            const toolbarWidth = 390;
            const toolbarHeight = 40;
            if (x - toolbarWidth / 2 < editorRect.left + 10) {
                x = editorRect.left + 10 + toolbarWidth / 2;
            } else if (x + toolbarWidth / 2 > editorRect.right - 10) {
                x = editorRect.right - 10 - toolbarWidth / 2;
            }
            if (y + toolbarHeight + 10 > editorRect.bottom) {
                y = editorRect.bottom - toolbarHeight - 10;
            } else if (y < editorRect.top + 10) {
                y = editorRect.top + 10;
            } else {
                y = y + 10;
            }
            this.setState({
                isTextToolbarOpen: true,
                textToolbarPosition: { x, y },
                editorRect,
                selectedTextRange: { start, end },
                selectedText,
                textToolbarType: format.type,
                textToolbarBold: format.bold,
                textToolbarItalic: format.italic,
                textToolbarUnderline: format.underline,
                textToolbarStrikethrough: format.strikethrough,
                textToolbarFontColor: '#000000',
                textToolbarBgColor: 'transparent',
                textToolbarFontFamily: 'default',
                textToolbarFontSize: '14px',
                textToolbarAlignment: 'left',
                isLinkDialogOpen: false,
                linkUrl: '',
                linkText: selectedText
            });
        } else {
            this.setState({
                isTextToolbarOpen: false,
                textToolbarPosition: null,
                editorRect: null,
                selectedTextRange: null
            });
        }
    };

    private handleGlobalClick = (e: MouseEvent): void => {
        const {
            isFormatMenuOpen,
            isTableGridOpen,
            isTextToolbarOpen
        } = this.state;
        const formatMenu = document.querySelector('.popover-scroll');
        const tableGridMenu = this.tableGridRef.current;
        const textToolbar = document.querySelector('.text-toolbar-container');
        const isClickInsideFormatMenu = formatMenu?.contains(e.target as Node);
        const isClickInsideTableGrid = tableGridMenu?.contains(e.target as Node);
        const isClickInsideTextToolbar = textToolbar?.contains(e.target as Node);
        if (isTextToolbarOpen && !isClickInsideTextToolbar) {
            this.setState({
                isTextToolbarOpen: false,
                textToolbarPosition: null
            });
        }
        if (isTableGridOpen) {
            if (!isClickInsideTableGrid && !isClickInsideFormatMenu) {
                this.setState({
                    isFormatMenuOpen: false,
                    isTableGridOpen: false,
                    tableGridPosition: null
                });
            }
        }
        else if (isFormatMenuOpen && !isTableGridOpen) {
            if (!isClickInsideFormatMenu) {
                this.setState({
                    isFormatMenuOpen: false
                });
            }
        }
    };

    private openTableGridSelect = (position: { x: number; y: number }): void => {
        this.setState({
            tableGridPosition: position,
            isTableGridOpen: true,
            tableHoveredRows: 0,
            tableHoveredCols: 0,
            isSelectingTable: true
        });
    };

    private handleTableGridMouseMove = (e: React.MouseEvent): void => {
        const { isSelectingTable, tableGridPosition } = this.state;
        if (!isSelectingTable || !tableGridPosition) return;
        const gridRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - gridRect.left - this.TABLE_GRID_PADDING;
        const y = e.clientY - gridRect.top - this.TABLE_GRID_PADDING;
        const cols = Math.min(
            Math.max(0, Math.floor(x / this.TABLE_CELL_SIZE)),
            this.TABLE_MAX_COLS - 1
        );
        const rows = Math.min(
            Math.max(0, Math.floor(y / this.TABLE_CELL_SIZE)),
            this.TABLE_MAX_ROWS - 1
        );
        this.setState({
            tableHoveredRows: rows + 1,
            tableHoveredCols: cols + 1
        });
    };

    private handleTableGridMouseClick = (): void => {
        const { tableHoveredRows, tableHoveredCols } = this.state;
        if (tableHoveredRows > 0 && tableHoveredCols > 0) {
            this.insertTable(tableHoveredRows, tableHoveredCols);
            this.setState({
                isTableGridOpen: false,
                isFormatMenuOpen: false,
                tableGridPosition: null,
                isSelectingTable: false
            });
        }
    };

    private renderTableGridSelect = (): React.ReactNode => {
        const { theme, tableGridPosition, tableHoveredRows, tableHoveredCols, isSelectingTable } = this.state;
        if (!tableGridPosition) return null;
        const isDark = theme === 'dark';
        return (
            <div
                ref={this.tableGridRef}
                className="table-grid-select-menu"
                style={{
                    position: 'fixed',
                    left: `${tableGridPosition.x}px`,
                    top: `${tableGridPosition.y}px`,
                    backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA',
                    padding: `${this.TABLE_GRID_PADDING}px`,
                    borderRadius: '4px',
                    border: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                    zIndex: 2002,
                    cursor: 'default',
                    pointerEvents: 'all'
                }}
                onMouseMove={this.handleTableGridMouseMove}
                onClick={this.handleTableGridMouseClick}
                onMouseLeave={() => {
                    if (isSelectingTable) {
                        this.setState({
                            tableHoveredRows: 0,
                            tableHoveredCols: 0
                        });
                    }
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${this.TABLE_MAX_COLS}, ${this.TABLE_CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${this.TABLE_MAX_ROWS}, ${this.TABLE_CELL_SIZE}px)`,
                    gap: '1px'
                }}>
                    {Array.from({ length: this.TABLE_MAX_ROWS * this.TABLE_MAX_COLS }).map((_, index) => {
                        const row = Math.floor(index / this.TABLE_MAX_COLS) + 1;
                        const col = (index % this.TABLE_MAX_COLS) + 1;
                        const isHovered = row <= tableHoveredRows && col <= tableHoveredCols;

                        let backgroundColor = isDark ? '#3A3A3A' : '#F0F0F0';
                        if (isHovered) {
                            backgroundColor = isDark ? '#48AFF0' : '#137CBD';
                        }

                        return (
                            <div
                                key={index}
                                style={{
                                    width: `${this.TABLE_CELL_SIZE}px`,
                                    height: `${this.TABLE_CELL_SIZE}px`,
                                    border: `1px solid ${isDark ? '#555555' : '#CCCCCC'}`,
                                    backgroundColor,
                                    transition: 'background-color 0.1s ease'
                                }}
                                title={`${row}×${col}`}
                            />
                        );
                    })}
                </div>
                <div style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: isDark ? '#CCCCCC' : '#333333',
                    marginTop: '8px',
                    height: '20px',
                    lineHeight: '20px'
                }}>
                    {tableHoveredRows > 0 && tableHoveredCols > 0
                        ? `${tableHoveredRows} × ${tableHoveredCols} 表格`
                        : '拖动鼠标选择表格尺寸'
                    }
                </div>
            </div>
        );
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
        }
    };

    private setupDragListeners = (): void => {
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
    };

    private cleanupDragListeners = (): void => {
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
    };

    private handleDragStart = (e: React.MouseEvent, lineNumber: number): void => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isDragging: true,
            dragStartY: e.clientY,
            dragLineNumber: lineNumber,
            dragIndicatorPosition: (lineNumber - 1) * this.LINE_HEIGHT
        });
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    };

    private handleDragMove = (e: MouseEvent): void => {
        const { isDragging, dragStartY, dragLineNumber } = this.state;
        if (!isDragging || dragLineNumber === null) return;
        const deltaY = e.clientY - dragStartY;
        if (Math.abs(deltaY) > this.DRAG_THRESHOLD) {
            const newPosition = (dragLineNumber - 1) * this.LINE_HEIGHT + deltaY;
            this.setState({
                dragIndicatorPosition: Math.max(0, newPosition)
            });
        }
    };

    private handleDragEnd = (e: MouseEvent): void => {
        const { isDragging, dragLineNumber, dragIndicatorPosition, activeNoteId, notes } = this.state;
        if (!isDragging || dragLineNumber === null || dragIndicatorPosition === null) {
            this.resetDragState();
            return;
        }
        const targetLineNumber = Math.round(dragIndicatorPosition / this.LINE_HEIGHT) + 1;
        if (targetLineNumber !== dragLineNumber && activeNoteId) {
            this.moveLine(dragLineNumber, targetLineNumber);
        }
        this.resetDragState();
    };

    private resetDragState = (): void => {
        this.setState({
            isDragging: false,
            dragStartY: 0,
            dragLineNumber: null,
            dragIndicatorPosition: null
        });
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    private moveLine = (fromLine: number, toLine: number): void => {
        const { activeNoteId, notes } = this.state;
        if (!activeNoteId) return;
        const activeNoteIndex = notes.findIndex(note => note.id === activeNoteId);
        if (activeNoteIndex === -1) return;
        const activeNote = notes[activeNoteIndex];
        const lines = activeNote.content.split('\n');
        const adjustedFromLine = Math.max(1, Math.min(fromLine, lines.length));
        const adjustedToLine = Math.max(1, Math.min(toLine, lines.length + 1));
        if (adjustedFromLine === adjustedToLine) return;
        const lineToMove = lines[adjustedFromLine - 1];
        lines.splice(adjustedFromLine - 1, 1);
        lines.splice(adjustedToLine - (adjustedToLine > adjustedFromLine ? 0 : 1), 0, lineToMove);
        const updatedContent = lines.join('\n');
        this.setState(prevState => ({
            notes: prevState.notes.map((note, index) =>
                index === activeNoteIndex
                    ? {
                        ...note,
                        content: updatedContent,
                        updatedAt: new Date()
                    }
                    : note
            )
        }));
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

    private handleContentMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        const { isDragging, isFormatMenuOpen } = this.state;
        if (isDragging) return;
        if (isFormatMenuOpen) return;
        const contentArea = e.currentTarget;
        const rect = contentArea.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const lineNumber = Math.max(1, Math.floor(y / this.LINE_HEIGHT) + 1);
        this.setState({
            hoveredLineNumber: lineNumber
        });
    };

    private handleTextAreaMouseLeave = (): void => {
        const { isDragging, isFormatMenuOpen } = this.state;
        if (!isDragging && !isFormatMenuOpen) {
            this.setState({ hoveredLineNumber: null });
        }
    };

    private insertFormatting = (format: string): void => {
        const { activeNoteId, notes, hoveredLineNumber, isFormatMenuOpen } = this.state;
        if (!activeNoteId || !this.contentRef.current) return;
        const textArea = this.contentRef.current;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const value = textArea.value;
        const lines = value.split('\n');
        let currentLineIndex = 0;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
            charCount += lines[i].length + 1;
            if (charCount > start) {
                currentLineIndex = i;
                break;
            }
        }
        if (format === 'table') {
            const formatMenu = document.querySelector('.popover-scroll') as HTMLElement;
            if (!formatMenu) return;
            const formatMenuRect = formatMenu.getBoundingClientRect();
            const position = {
                x: formatMenuRect.right + 10,
                y: formatMenuRect.top
            };
            this.openTableGridSelect(position);
            this.setState({ isFormatMenuOpen: true });
            return;
        }
        let newValue = value;
        let newCursorPos = start;
        const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
        const currentLineEnd = value.indexOf('\n', start);
        const currentLine = value.substring(
            currentLineStart,
            currentLineEnd === -1 ? value.length : currentLineEnd
        );
        let insertPosition = currentLineEnd === -1 ? value.length : currentLineEnd;
        if (currentLineEnd === -1) {
            newValue = value + '\n';
            insertPosition = newValue.length - 1;
        }
        switch (format) {
            case 'normal':
                newValue = value.substring(0, insertPosition) + '\nText' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'h1':
                newValue = value.substring(0, insertPosition) + '\n# Heading 1' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'h2':
                newValue = value.substring(0, insertPosition) + '\n## Heading 2' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'h3':
                newValue = value.substring(0, insertPosition) + '\n### Heading 3' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'ul':
                newValue = value.substring(0, insertPosition) + '\n- List item' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'ol':
                newValue = value.substring(0, insertPosition) + '\n1. List item' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'task':
                newValue = value.substring(0, insertPosition) + '\n- [ ] Task item' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'quote':
                newValue = value.substring(0, insertPosition) + '\n> Quote text' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'code':
                newValue = value.substring(0, insertPosition) + '\n```\nCode block\n```' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'image':
                newValue = value.substring(0, insertPosition) + '\n![Alt text](image-url)' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'link':
                newValue = value.substring(0, insertPosition) + '\n[Link text](url)' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'attachment':
                newValue = value.substring(0, insertPosition) + '\n[Attachment](file:///path/to/file)' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
            case 'table':
                newValue = value.substring(0, insertPosition) + '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n' + value.substring(insertPosition);
                newCursorPos = insertPosition + 1;
                break;
        }
        this.setState(prevState => ({
            isFormatMenuOpen: false,
            isTableGridOpen: false,
            notes: prevState.notes.map(note =>
                note.id === activeNoteId
                    ? { ...note, content: newValue, updatedAt: new Date() }
                    : note
            )
        }));
        setTimeout(() => {
            if (this.contentRef.current) {
                this.contentRef.current.focus();
                if (format === 'normal') {
                    this.contentRef.current.setSelectionRange(newCursorPos + 4, newCursorPos + 4);
                } else if (format === 'h1') {
                    this.contentRef.current.setSelectionRange(newCursorPos + 11, newCursorPos + 11);
                } else if (format === 'attachment') {
                    this.contentRef.current.setSelectionRange(newCursorPos + 1, newCursorPos + 11);
                } else {
                    this.contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            }
        }, 10);
        this.setState({ isFormatMenuOpen: false });
    };

    private insertTable = (rows: number, cols: number): void => {
        const { activeNoteId, notes } = this.state;
        if (!activeNoteId || !this.contentRef.current) return;
        const textArea = this.contentRef.current;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const value = textArea.value;
        let table = '\n';
        table += '|';
        for (let i = 1; i <= cols; i++) {
            table += ` Header ${i} |`;
        }
        table += '\n|';
        for (let i = 1; i <= cols; i++) {
            table += '----------|';
        }
        for (let r = 1; r <= rows; r++) {
            table += '\n|';
            for (let c = 1; c <= cols; c++) {
                table += ` Cell ${(r - 1) * cols + c}   |`;
            }
        }
        table += '\n';
        const newValue = value.substring(0, start) + table + value.substring(end);
        this.setState(prevState => ({
            notes: prevState.notes.map(note =>
                note.id === activeNoteId
                    ? { ...note, content: newValue, updatedAt: new Date() }
                    : note
            ),
            isTableGridOpen: false
        }));
        setTimeout(() => {
            if (this.contentRef.current) {
                this.contentRef.current.focus();
                this.contentRef.current.setSelectionRange(start + 1, start + 1);
            }
        }, 10);
    };

    private renderFormatMenu = () => {
        const { theme, hoveredLineNumber } = this.state;
        const isDark = theme === 'dark';
        const formatOptions = [
            { icon: 'paragraph', label: '正文', value: 'normal' },
            { icon: 'header-one', label: '一级标题', value: 'h1' },
            { icon: 'header-two', label: '二级标题', value: 'h2' },
            { icon: 'header-three', label: '三级标题', value: 'h3' },
            { icon: 'list', label: '无序列表', value: 'ul' },
            { icon: 'numbered-list', label: '有序列表', value: 'ol' },
            { icon: 'tick', label: '任务列表', value: 'task' },
            { icon: 'citation', label: '引用块', value: 'quote' },
            { icon: 'code', label: '代码块', value: 'code' },
            { icon: 'media', label: '图片', value: 'image' },
            { icon: 'th', label: '表格', value: 'table' },
            { icon: 'link', label: '链接', value: 'link' },
            { icon: 'paperclip', label: '附件', value: 'attachment' }
        ];
        return (
            <div
                style={{
                    backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA',
                    padding: '4px',
                    width: '180px',
                    maxHeight: '270px',
                    overflow: 'auto',
                    borderRadius: '4px',
                    border: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    position: 'relative'
                }}
                className="popover-scroll"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <div style={{
                    position: 'relative'
                }}>
                    {formatOptions.map((option) => (
                        <div
                            key={option.value}
                            style={{
                                padding: '6px 8px',
                                margin: '1px 0',
                                borderRadius: '3px',
                                color: isDark ? '#CCCCCC' : '#333333',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '13px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? 'rgba(72, 175, 240, 0.2)' : 'rgba(19, 124, 189, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.insertFormatting(option.value);
                            }}
                        >
                            <Icon
                                icon={option.icon as any}
                                style={{
                                    marginRight: '8px',
                                    color: isDark ? '#8A8A8A' : '#666666'
                                }}
                                iconSize={14}
                            />
                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
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

    private renderLineNumbers = () => {
        const { theme, hoveredLineNumber, isDragging, dragIndicatorPosition, isFormatMenuOpen } = this.state;
        const isDark = theme === 'dark';
        const activeNote = this.getActiveNote();
        const lineCount = activeNote ? activeNote.content.split('\n').length + 1 : 1;
        const popoverTop = hoveredLineNumber ? (hoveredLineNumber - 1) * this.LINE_HEIGHT + this.LINE_HEIGHT + 4 : 0;
        return (
            <div
                style={{
                    width: '60px',
                    height: '100%',
                    backgroundColor: isDark ? '#000000' : '#FFFFFF',
                    position: 'relative',
                    flexShrink: 0,
                }}
                onMouseMove={this.handleContentMouseMove}
                onMouseLeave={this.handleTextAreaMouseLeave}
            >
                {dragIndicatorPosition !== null && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${dragIndicatorPosition}px`,
                            left: 0,
                            right: 0,
                            height: '2px',
                            backgroundColor: isDark ? '#48AFF0' : '#137CBD',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    />
                )}
                {hoveredLineNumber && !isDragging && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${Math.max(0, (hoveredLineNumber - 1) * this.LINE_HEIGHT)}px`,
                            display: 'flex',
                            gap: '2px',
                            zIndex: 100,
                            right: '8px',
                            alignItems: 'center',
                            height: `${this.LINE_HEIGHT}px`
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div style={{ position: 'relative' }}>
                            <Button
                                icon="plus"
                                minimal
                                small
                                style={{
                                    padding: '2px',
                                    minWidth: '20px',
                                    minHeight: '20px',
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    opacity: 0.7
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (this.contentRef.current && hoveredLineNumber) {
                                        const textArea = this.contentRef.current;
                                        const value = textArea.value;
                                        const lines = value.split('\n');
                                        let lineStartIndex = 0;
                                        for (let i = 0; i < hoveredLineNumber - 1; i++) {
                                            lineStartIndex += lines[i].length + 1;
                                        }
                                        const lineEndIndex = lineStartIndex + lines[hoveredLineNumber - 1]?.length || 0;
                                        textArea.focus();
                                        textArea.setSelectionRange(lineEndIndex, lineEndIndex);
                                    }
                                    this.setState(prevState => ({
                                        isFormatMenuOpen: !prevState.isFormatMenuOpen
                                    }));
                                }}
                                onFocus={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.blur();
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                                title="Insert formatting"
                            />
                        </div>
                        <Button
                            icon="drag-handle-vertical"
                            minimal
                            small
                            style={{
                                padding: '2px',
                                minWidth: '20px',
                                minHeight: '20px',
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                cursor: 'grab',
                                opacity: 0.7
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.handleDragStart(e, hoveredLineNumber);
                            }}
                            onFocus={(e) => {
                                e.stopPropagation();
                                e.currentTarget.blur();
                            }}
                            title="Drag to reorder line"
                        />
                    </div>
                )}
                {isFormatMenuOpen && hoveredLineNumber && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${popoverTop}px`,
                            left: '60px',
                            zIndex: 2000,
                            pointerEvents: 'all'
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        {this.renderFormatMenu()}
                    </div>
                )}
            </div>
        );
    };

    render() {
        const {
            theme,
            searchQuery,
            isDeleteDialogOpen,
            leftPanelWidth,
            isLeftPanelVisible,
            isResizing,
            isDragging,
            dragIndicatorPosition,
            isTableGridOpen,
            isTextToolbarOpen,
            textToolbarPosition,
            textToolbarType,
            textToolbarBold,
            textToolbarItalic,
            textToolbarUnderline,
            textToolbarStrikethrough,
            textToolbarFontColor,
            textToolbarBgColor,
            textToolbarFontFamily,
            textToolbarFontSize,
            textToolbarAlignment,
            isLinkDialogOpen,
            linkUrl,
            linkText,
            selectedText
        } = this.state;

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
                    cursor: isResizing ? 'col-resize' : (isDragging ? 'grabbing' : 'default')
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
                .popover-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .popover-scroll::-webkit-scrollbar-track {
                    background: ${isDark ? '#3A3A3A' : '#F0F0F0'};
                    border-radius: 3px;
                }
                .popover-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#555555' : '#CCCCCC'};
                    border-radius: 3px;
                }
                .popover-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#666666' : '#BBBBBB'};
                }
                .text-toolbar-container {
                    z-index: 3000;
                }
                .left-panel-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: ${isDark ? '#555555 #1A1A1A' : '#CCCCCC #F5F5F5'};
                }
                .right-content-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: ${isDark ? '#444444 #0A0A0A' : '#DDDDDD #F0F0F0'};
                }
                .popover-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: ${isDark ? '#555555 #3A3A3A' : '#CCCCCC #F0F0F0'};
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

                {isTextToolbarOpen && textToolbarPosition && (
                    <div className="text-toolbar-container">
                        <TextToolbar
                            theme={theme}
                            position={textToolbarPosition}
                            editorRect={this.state.editorRect}
                            selectedText={selectedText}
                            textType={textToolbarType}
                            bold={textToolbarBold}
                            italic={textToolbarItalic}
                            underline={textToolbarUnderline}
                            strikethrough={textToolbarStrikethrough}
                            fontColor={textToolbarFontColor}
                            bgColor={textToolbarBgColor}
                            fontFamily={textToolbarFontFamily}
                            fontSize={textToolbarFontSize}
                            alignment={textToolbarAlignment}
                            isLinkDialogOpen={isLinkDialogOpen}
                            linkUrl={linkUrl}
                            linkText={linkText}

                            onTextTypeChange={this.handleTextTypeChange}
                            onBoldToggle={this.handleBoldToggle}
                            onItalicToggle={this.handleItalicToggle}
                            onUnderlineToggle={this.handleUnderlineToggle}
                            onStrikethroughToggle={this.handleStrikethroughToggle}
                            onFontColorChange={this.handleFontColorChange}
                            onBgColorChange={this.handleBgColorChange}
                            onFontFamilyChange={this.handleFontFamilyChange}
                            onFontSizeChange={this.handleFontSizeChange}
                            onAlignmentChange={this.handleAlignmentChange}
                            onLinkDialogOpen={this.handleLinkDialogOpen}
                            onLinkDialogClose={this.handleLinkDialogClose}
                            onLinkUrlChange={this.handleLinkUrlChange}
                            onLinkApply={this.handleLinkApply}
                            onFormatApply={this.handleFormatApply}
                        />
                    </div>
                )}

                {isTableGridOpen && this.renderTableGridSelect()}

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
                    ref={this.textAreaContainerRef}
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
                        />
                        <Button
                            icon="chevron-right"
                            minimal={true}
                            small={true}
                            title="Next"
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
                            paddingLeft: '60px'
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
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {this.renderLineNumbers()}
                        <div
                            style={{
                                flex: 1,
                                padding: '0',
                                backgroundColor: isDark ? '#000000' : '#FFFFFF',
                                position: 'relative'
                            }}
                            onMouseMove={this.handleContentMouseMove}
                            onMouseLeave={this.handleTextAreaMouseLeave}
                        >
                            {dragIndicatorPosition !== null && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: `${dragIndicatorPosition}px`,
                                        left: '0',
                                        right: '0',
                                        height: '2px',
                                        backgroundColor: isDark ? '#48AFF0' : '#137CBD',
                                        zIndex: 1000,
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}
                            {isDragging && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 999,
                                    cursor: 'grabbing'
                                }} />
                            )}
                            <TextArea
                                inputRef={this.contentRef}
                                placeholder="Start typing note content...\nSupports Markdown format"
                                value={activeNote?.content || ''}
                                onChange={this.handleContentChange}
                                style={{
                                    paddingTop: '0',
                                    paddingBottom: '0',
                                    width: '100%',
                                    height: '100%',
                                    minHeight: 'calc(100vh - 120px)',
                                    fontSize: '14px',
                                    lineHeight: `${this.LINE_HEIGHT}px`,
                                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    resize: 'none',
                                    color: isDark ? '#CCCCCC' : '#333333',
                                    paddingLeft: '12px',
                                    paddingRight: '12px'
                                }}
                                fill={true}
                                growVertically={true}
                                className="right-content-scroll"
                            />
                        </div>
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