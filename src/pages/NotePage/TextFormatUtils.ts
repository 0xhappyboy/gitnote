export class TextFormatUtils {

    static applyTextFormat(
        content: string,
        start: number,
        end: number,
        format: {
            type: string;
            bold: boolean;
            italic: boolean;
            underline: boolean;
            strikethrough: boolean;
            fontColor: string;
            bgColor: string;
            fontFamily: string;
            fontSize: string;
            alignment: string;
        }
    ): string {
        const selectedText = content.substring(start, end);

        if (!selectedText.trim()) return content;

        let formattedText = selectedText;

        switch (format.type) {
            case 'h1':
                formattedText = `# ${selectedText}`;
                break;
            case 'h2':
                formattedText = `## ${selectedText}`;
                break;
            case 'h3':
                formattedText = `### ${selectedText}`;
                break;
            case 'h4':
                formattedText = `#### ${selectedText}`;
                break;
            case 'h5':
                formattedText = `##### ${selectedText}`;
                break;
            case 'h6':
                formattedText = `###### ${selectedText}`;
                break;
            case 'ul':
                formattedText = `- ${selectedText}`;
                break;
            case 'ol':
                formattedText = `1. ${selectedText}`;
                break;
            case 'inline-code':
                formattedText = `\`${selectedText}\``;
                break;
            case 'blockquote':
                formattedText = `> ${selectedText}`;
                break;
        }

        if (format.bold) {
            formattedText = `**${formattedText}**`;
        }

        if (format.italic) {
            formattedText = `*${formattedText}*`;
        }

        if (format.underline) {
            formattedText = `<u>${formattedText}</u>`;
        }

        if (format.strikethrough) {
            formattedText = `~~${formattedText}~~`;
        }

        if (format.fontColor && format.fontColor !== '#000000' && format.fontColor !== 'transparent') {
            formattedText = `<span style="color: ${format.fontColor}">${formattedText}</span>`;
        }

        if (format.bgColor && format.bgColor !== 'transparent') {
            formattedText = `<span style="background-color: ${format.bgColor}">${formattedText}</span>`;
        }


        return content.substring(0, start) + formattedText + content.substring(end);
    }

    static applyLink(
        content: string,
        start: number,
        end: number,
        url: string
    ): string {
        const selectedText = content.substring(start, end);
        const linkText = `[${selectedText}](${url})`;
        return content.substring(0, start) + linkText + content.substring(end);
    }

    static detectFormatAtPosition(
        content: string,
        position: number
    ): {
        type: string;
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikethrough: boolean;
    } {
        const format = {
            type: 'normal',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false
        };
        if (position < 0 || position > content.length) return format;
        const checkRange = 10;
        const start = Math.max(0, position - checkRange);
        const end = Math.min(content.length, position + checkRange);
        const context = content.substring(start, end);
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        while ((match = boldRegex.exec(context)) !== null) {
            if (position >= start + match.index && position <= start + match.index + match[0].length) {
                format.bold = true;
                break;
            }
        }
        const italicRegex = /\*(.*?)\*/g;
        while ((match = italicRegex.exec(context)) !== null) {
            if (position >= start + match.index && position <= start + match.index + match[0].length) {
                format.italic = true;
                break;
            }
        }
        const strikethroughRegex = /~~(.*?)~~/g;
        while ((match = strikethroughRegex.exec(context)) !== null) {
            if (position >= start + match.index && position <= start + match.index + match[0].length) {
                format.strikethrough = true;
                break;
            }
        }
        const lineStart = content.lastIndexOf('\n', position - 1) + 1;
        const lineEnd = content.indexOf('\n', position);
        const line = content.substring(
            lineStart,
            lineEnd === -1 ? content.length : lineEnd
        );
        if (line.startsWith('# ')) format.type = 'h1';
        else if (line.startsWith('## ')) format.type = 'h2';
        else if (line.startsWith('### ')) format.type = 'h3';
        else if (line.startsWith('#### ')) format.type = 'h4';
        else if (line.startsWith('##### ')) format.type = 'h5';
        else if (line.startsWith('###### ')) format.type = 'h6';
        else if (line.startsWith('- ')) format.type = 'ul';
        else if (/^\d+\. /.test(line)) format.type = 'ol';
        else if (line.startsWith('> ')) format.type = 'blockquote';
        else if (line.includes('`')) format.type = 'inline-code';
        return format;
    }
}