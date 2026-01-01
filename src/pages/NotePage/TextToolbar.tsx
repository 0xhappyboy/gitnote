import React, { useEffect, useRef } from 'react';
import {
    Button,
    Icon,
    Menu,
    MenuItem,
    InputGroup,
    Popover,
    Classes
} from '@blueprintjs/core';

interface TextToolbarProps {
    theme: 'dark' | 'light';
    position: { x: number; y: number };
    editorRect: DOMRect | null;
    selectedText: string;
    textType: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    fontColor: string;
    bgColor: string;
    fontFamily: string;
    fontSize: string;
    alignment: string;
    isLinkDialogOpen: boolean;
    linkUrl: string;
    linkText: string;
    onTextTypeChange: (type: string) => void;
    onBoldToggle: () => void;
    onItalicToggle: () => void;
    onUnderlineToggle: () => void;
    onStrikethroughToggle: () => void;
    onFontColorChange: (color: string) => void;
    onBgColorChange: (color: string) => void;
    onFontFamilyChange: (font: string) => void;
    onFontSizeChange: (size: string) => void;
    onAlignmentChange: (alignment: string) => void;
    onLinkDialogOpen: () => void;
    onLinkDialogClose: () => void;
    onLinkUrlChange: (url: string) => void;
    onLinkApply: () => void;
    onFormatApply: () => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
    theme,
    position,
    selectedText,
    textType,
    bold,
    italic,
    underline,
    strikethrough,
    fontColor,
    bgColor,
    fontFamily,
    fontSize,
    alignment,
    isLinkDialogOpen,
    linkUrl,
    linkText,
    editorRect,
    onTextTypeChange,
    onBoldToggle,
    onItalicToggle,
    onUnderlineToggle,
    onStrikethroughToggle,
    onFontColorChange,
    onBgColorChange,
    onFontFamilyChange,
    onFontSizeChange,
    onAlignmentChange,
    onLinkDialogOpen,
    onLinkDialogClose,
    onLinkUrlChange,
    onLinkApply,
    onFormatApply
}) => {
    const isDark = theme === 'dark';
    const toolbarRef = useRef<HTMLDivElement>(null);
    const textTypes = [
        { value: 'normal', label: '正文' },
        { value: 'h1', label: '一级标题' },
        { value: 'h2', label: '二级标题' },
        { value: 'h3', label: '三级标题' },
        { value: 'h4', label: '四级标题' },
        { value: 'h5', label: '五级标题' },
        { value: 'h6', label: '六级标题' },
        { value: 'ol', label: '有序列表' },
        { value: 'ul', label: '无序列表' },
        { value: 'inline-code', label: '行内代码' },
        { value: 'blockquote', label: '引用块' }
    ];
    const fontFamilies = [
        { value: 'default', label: '默认' },
        { value: 'serif', label: '宋体' },
        { value: 'sans-serif', label: '黑体' },
        { value: 'monospace', label: '等宽字体' }
    ];
    const fontSizes = [
        { value: '12px', label: '12' },
        { value: '14px', label: '14' },
        { value: '16px', label: '16' },
        { value: '18px', label: '18' },
        { value: '20px', label: '20' },
        { value: '24px', label: '24' },
        { value: '28px', label: '28' },
        { value: '32px', label: '32' }
    ];
    const alignments = [
        { value: 'left', label: '左对齐', icon: 'align-left' },
        { value: 'center', label: '居中对齐', icon: 'align-center' },
        { value: 'right', label: '右对齐', icon: 'align-right' }
    ];
    const colors = [
        '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
        '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF',
        '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#CFE2F3', '#D9D2E9', '#EAD1DC',
        '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD',
        '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6FA8DC', '#8E7CC3', '#C27BA0',
        '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79',
        '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#0B5394', '#351C75', '#741B47',
        '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#073763', '#20124D', '#4C1130'
    ];
    const bgColors = [
        'transparent',
        '#FFFF00', '#FFE4E1', '#E0FFFF', '#F0FFF0', '#FFF8DC',
        '#FFD700', '#FFB6C1', '#87CEFA', '#98FB98', '#F0E68C'
    ];
    const getTextTypeIcon = (value: string) => {
        switch (value) {
            case 'h1': return 'header-one';
            case 'h2': return 'header-two';
            case 'h3': return 'header-three';
            case 'ol': return 'numbered-list';
            case 'ul': return 'list';
            case 'inline-code': return 'code';
            case 'blockquote': return 'citation';
            default: return 'paragraph';
        }
    };
    const getFontSizeLabel = (value: string) => {
        const size = fontSizes.find(s => s.value === value);
        return size ? size.label.replace('px', '') : '14';
    };
    const calculateToolbarPosition = () => {
        const buttonWidth = 26;
        const buttonSpacing = 5;
        const buttonCount = 12;
        const totalWidth = buttonCount * buttonWidth + (buttonCount - 1) * buttonSpacing + 16;
        const toolbarHeight = 40;
        let left = position.x - totalWidth / 2;
        let top = position.y + 10;
        if (!editorRect) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            if (left < 10) left = 10;
            if (left + totalWidth > screenWidth - 10) {
                left = screenWidth - totalWidth - 10;
            }
            if (top + toolbarHeight + 50 > screenHeight) {
                top = position.y - toolbarHeight - 10;
            }
            if (top < 10) top = 10;
        } else {
            const editorLeft = editorRect.left;
            const editorTop = editorRect.top;
            const editorRight = editorRect.right;
            const editorBottom = editorRect.bottom;
            if (left < editorLeft + 10) {
                left = editorLeft + 10;
            }
            if (left + totalWidth > editorRight - 10) {
                left = editorRight - totalWidth - 10;
            }
            if (top + toolbarHeight > editorBottom - 10) {
                top = position.y - toolbarHeight - 10;
            }
            if (top < editorTop + 10) {
                top = editorTop + 10;
            }
            if (top + toolbarHeight > editorBottom - 10) {
                top = Math.max(editorTop + 10, position.y - toolbarHeight - 10);
            }
        }
        return { left, top, width: totalWidth };
    };
    const { left, top, width } = calculateToolbarPosition();
    const createStyledDiv = (children: React.ReactNode, maxHeight?: string, customStyle?: React.CSSProperties) => (
        <div style={{
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            border: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`,
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxHeight: maxHeight || '300px',
            overflow: 'auto',
            ...customStyle
        }}>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: ${isDark ? '#3A3A3A' : '#F5F5F5'};
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: ${isDark ? '#555555' : '#CCCCCC'};
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: ${isDark ? '#666666' : '#999999'};
                    }
                `}
            </style>
            <div className="custom-scrollbar" style={{ height: '100%', width: '100%' }}>
                {children}
            </div>
        </div>
    );

    return (
        <div
            ref={toolbarRef}
            style={{
                position: 'fixed',
                left: `${left}px`,
                top: `${top}px`,
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                border: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`,
                borderRadius: '4px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                zIndex: 3000,
                padding: '6px 8px',
                height: '40px',
                width: `${width}px`,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <style>
                {`.bp6-popover-transition-container { top: 40px !important; }`}
            </style>
            <style>
                {`
                div[style*="position: fixed"] button.bp6-button,
                div[style*="position: fixed"] button.bp6-button:focus,
                div[style*="position: fixed"] button.bp6-button:active,
                div[style*="position: fixed"] button.bp6-button:hover,
                div[style*="position: fixed"] button.bp6-button.bp6-active {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                    background-color: transparent !important;
                }
                div[style*="position: fixed"] .bp6-button * {
                    outline: none !important;
                }
                [class*="TextToolbar"] button,
                [class*="TextToolbar"] button:focus,
                [class*="TextToolbar"] button:active {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}
            </style>
            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <Menu style={{
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                                minWidth: '120px',
                                padding: 0
                            }}>
                                {textTypes.map((type) => (
                                    <MenuItem
                                        key={type.value}
                                        icon={getTextTypeIcon(type.value) as any}
                                        text={type.label}
                                        onClick={() => onTextTypeChange(type.value)}
                                        style={{
                                            backgroundColor: textType === type.value
                                                ? (isDark ? '#48AFF0' : '#137CBD')
                                                : 'transparent',
                                            color: textType === type.value ? '#FFFFFF' : 'inherit'
                                        }}
                                    />
                                ))}
                            </Menu>
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        icon={getTextTypeIcon(textType) as any}
                        minimal
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent'
                        }}
                        title="文本类型"
                    />
                </Popover>
            </div>

            <Button
                icon="bold"
                minimal
                active={bold}
                onClick={onBoldToggle}
                title="加粗"
                style={{
                    width: '26px',
                    height: '26px',
                    padding: '0',
                    minWidth: '26px',
                    minHeight: '26px',
                    borderRadius: '3px',
                    backgroundColor: bold ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                }}
            />

            <Button
                icon="italic"
                minimal
                active={italic}
                onClick={onItalicToggle}
                title="斜体"
                style={{
                    width: '26px',
                    height: '26px',
                    padding: '0',
                    minWidth: '26px',
                    minHeight: '26px',
                    borderRadius: '3px',
                    backgroundColor: italic ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                }}
            />

            <Button
                icon="underline"
                minimal
                active={underline}
                onClick={onUnderlineToggle}
                title="下划线"
                style={{
                    width: '26px',
                    height: '26px',
                    padding: '0',
                    minWidth: '26px',
                    minHeight: '26px',
                    borderRadius: '3px',
                    backgroundColor: underline ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                }}
            />

            <Button
                icon="strikethrough"
                minimal
                active={strikethrough}
                onClick={onStrikethroughToggle}
                title="删除线"
                style={{
                    width: '26px',
                    height: '26px',
                    padding: '0',
                    minWidth: '26px',
                    minHeight: '26px',
                    borderRadius: '3px',
                    backgroundColor: strikethrough ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'
                }}
            />

            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <Menu style={{
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                                minWidth: '100px',
                                padding: 0
                            }}>
                                {fontFamilies.map((font) => (
                                    <MenuItem
                                        key={font.value}
                                        text={font.label}
                                        onClick={() => onFontFamilyChange(font.value)}
                                        style={{
                                            backgroundColor: fontFamily === font.value
                                                ? (isDark ? '#48AFF0' : '#137CBD')
                                                : 'transparent',
                                            color: fontFamily === font.value ? '#FFFFFF' : 'inherit'
                                        }}
                                    />
                                ))}
                            </Menu>
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        minimal
                        title="字体"
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            fontSize: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        F
                    </Button>
                </Popover>
            </div>

            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <Menu style={{
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                                minWidth: '80px',
                                padding: 0
                            }}>
                                {fontSizes.map((size) => (
                                    <MenuItem
                                        key={size.value}
                                        text={size.label}
                                        onClick={() => onFontSizeChange(size.value)}
                                        style={{
                                            backgroundColor: fontSize === size.value
                                                ? (isDark ? '#48AFF0' : '#137CBD')
                                                : 'transparent',
                                            color: fontSize === size.value ? '#FFFFFF' : 'inherit'
                                        }}
                                    />
                                ))}
                            </Menu>
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        title="字体大小"
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            fontSize: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        {getFontSizeLabel(fontSize)}
                    </Button>
                </Popover>
            </div>

            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <div style={{
                                padding: '12px',
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(10, 1fr)',
                                    gap: '6px',
                                    marginBottom: '12px'
                                }}>
                                    {colors.map((color) => (
                                        <div
                                            key={color}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                backgroundColor: color,
                                                border: `2px solid ${fontColor === color ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                boxSizing: 'border-box'
                                            }}
                                            title={`颜色值: ${color}`}
                                            onClick={() => onFontColorChange(color)}
                                        />
                                    ))}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '8px',
                                    paddingTop: '8px',
                                    borderTop: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: fontColor,
                                        border: `1px solid ${isDark ? '#666666' : '#999999'}`,
                                        borderRadius: '3px'
                                    }} />
                                    <div style={{
                                        color: isDark ? '#CCCCCC' : '#666666',
                                        fontSize: '12px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {fontColor}
                                    </div>
                                </div>
                            </div>,
                            '300px',
                            { maxWidth: '320px' }
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        minimal
                        title="字体颜色"
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '14px',
                            height: '3px',
                            backgroundColor: fontColor === 'transparent' ? (isDark ? '#CCCCCC' : '#666666') : fontColor,
                            borderRadius: '1px'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '3px',
                            width: '20px',
                            height: '10px',
                            backgroundColor: fontColor === 'transparent' ? (isDark ? '#CCCCCC' : '#666666') : fontColor,
                            borderRadius: '2px'
                        }} />
                    </Button>
                </Popover>
            </div>

            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <div style={{
                                padding: '12px',
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(8, 1fr)',
                                    gap: '6px',
                                    marginBottom: '12px'
                                }}>
                                    {colors.slice(0, 40).map((color) => (
                                        <div
                                            key={color}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                backgroundColor: color,
                                                border: `2px solid ${bgColor === color ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                boxSizing: 'border-box'
                                            }}
                                            title={`颜色值: ${color}`}
                                            onClick={() => onBgColorChange(color)}
                                        />
                                    ))}
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '6px',
                                    marginBottom: '12px'
                                }}>
                                    {bgColors.map((color) => (
                                        <div
                                            key={color}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                backgroundColor: color === 'transparent'
                                                    ? (isDark ? '#444444' : '#CCCCCC')
                                                    : color,
                                                border: `2px solid ${bgColor === color ? (isDark ? '#48AFF0' : '#137CBD') : 'transparent'}`,
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                boxSizing: 'border-box',
                                                position: 'relative'
                                            }}
                                            title={color === 'transparent' ? '透明' : `颜色值: ${color}`}
                                            onClick={() => onBgColorChange(color)}
                                        >
                                            {color === 'transparent' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '0',
                                                    right: '0',
                                                    height: '2px',
                                                    backgroundColor: isDark ? '#FF0000' : '#FF0000',
                                                    transform: 'rotate(45deg)'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '8px',
                                    paddingTop: '8px',
                                    borderTop: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: bgColor === 'transparent'
                                            ? (isDark ? '#444444' : '#CCCCCC')
                                            : bgColor,
                                        border: `1px solid ${isDark ? '#666666' : '#999999'}`,
                                        borderRadius: '3px',
                                        position: 'relative'
                                    }}>
                                        {bgColor === 'transparent' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '0',
                                                right: '0',
                                                height: '2px',
                                                backgroundColor: isDark ? '#FF0000' : '#FF0000',
                                                transform: 'rotate(45deg)'
                                            }} />
                                        )}
                                    </div>
                                    <div style={{
                                        color: isDark ? '#CCCCCC' : '#666666',
                                        fontSize: '12px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {bgColor === 'transparent' ? 'transparent' : bgColor}
                                    </div>
                                </div>
                            </div>,
                            '300px',
                            { maxWidth: '280px' }
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        minimal
                        title="背景颜色"
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '14px',
                            height: '14px',
                            backgroundColor: bgColor === 'transparent'
                                ? (isDark ? '#CCCCCC' : '#666666')
                                : bgColor,
                            borderRadius: '2px',
                            border: `1px solid ${isDark ? '#666666' : '#999999'}`
                        }} />
                    </Button>
                </Popover>
            </div>

            <div style={{ position: 'relative' }}>
                <Popover
                    content={
                        createStyledDiv(
                            <Menu style={{
                                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                                minWidth: '120px',
                                padding: 0
                            }}>
                                {alignments.map((align) => (
                                    <MenuItem
                                        key={align.value}
                                        icon={align.icon as any}
                                        text={align.label}
                                        onClick={() => onAlignmentChange(align.value)}
                                        style={{
                                            backgroundColor: alignment === align.value
                                                ? (isDark ? '#48AFF0' : '#137CBD')
                                                : 'transparent',
                                            color: alignment === align.value ? '#FFFFFF' : 'inherit'
                                        }}
                                    />
                                ))}
                            </Menu>
                        )
                    }
                    position="bottom"
                    minimal
                    usePortal={false}
                    popoverClassName="toolbar-popover"
                    modifiers={{
                        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                        offset: { enabled: true, offset: '0, 5' }
                    }}
                >
                    <Button
                        icon="align-left"
                        minimal
                        title="对齐方式"
                        style={{
                            width: '26px',
                            height: '26px',
                            padding: '0',
                            minWidth: '26px',
                            minHeight: '26px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent'
                        }}
                    />
                </Popover>
            </div>

            <Button
                icon="link"
                minimal
                onClick={onLinkDialogOpen}
                title="超链接"
                style={{
                    width: '26px',
                    height: '26px',
                    padding: '0',
                    minWidth: '26px',
                    minHeight: '26px',
                    borderRadius: '3px',
                    backgroundColor: 'transparent'
                }}
            />

            {isLinkDialogOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#444444' : '#E1E1E1'}`,
                    borderRadius: '4px',
                    padding: '12px',
                    marginTop: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 3001,
                    width: '300px'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        <InputGroup
                            placeholder="链接文本"
                            value={linkText}
                            readOnly
                            small
                            fill
                            style={{
                                backgroundColor: isDark ? '#3A3A3A' : '#F5F5F5',
                                marginBottom: '8px'
                            }}
                        />
                        <InputGroup
                            placeholder="输入链接地址 (http://...)"
                            value={linkUrl}
                            onChange={(e) => onLinkUrlChange(e.target.value)}
                            small
                            fill
                            style={{
                                backgroundColor: isDark ? '#3A3A3A' : '#F5F5F5'
                            }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                    }}>
                        <Button
                            small
                            onClick={onLinkDialogClose}
                        >
                            取消
                        </Button>
                        <Button
                            intent="primary"
                            small
                            onClick={onLinkApply}
                            disabled={!linkUrl.trim()}
                        >
                            应用
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextToolbar;