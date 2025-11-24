import os
import re

def split_html_file(file_path, folder):
    base_name = os.path.splitext(os.path.basename(file_path))[0]  # filename only

    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Extract style & script content
    css_content = "\n".join(re.findall(r'<style.*?>(.*?)</style>', content, re.DOTALL)).strip()
    js_content = "\n".join(re.findall(r'<script.*?>(.*?)</script>', content, re.DOTALL)).strip()

    # Remove style and script blocks from HTML
    pure_html = re.sub(r'<style.*?>.*?</style>', '', content, flags=re.DOTALL)
    pure_html = re.sub(r'<script.*?>.*?</script>', '', pure_html, flags=re.DOTALL)

    # Insert external file paths automatically
    pure_html = pure_html.replace(
        '</head>', 
        f'    <link rel="stylesheet" href="../css/{base_name}.css">\n</head>'
    )
    pure_html = pure_html.replace(
        '</body>', 
        f'    <script src="../js/{base_name}.js"></script>\n</body>'
    )

    # Save new HTML file
    with open(os.path.join(folder, f'{base_name}.html'), 'w', encoding='utf-8') as f:
        f.write(pure_html.strip())

    # Ensure css & js folders exist
    os.makedirs(os.path.join(folder, "../css"), exist_ok=True)
    os.makedirs(os.path.join(folder, "../js"), exist_ok=True)

    # Save CSS and JS files
    with open(os.path.join(folder, "../css", f'{base_name}.css'), 'w', encoding='utf-8') as f:
        f.write(css_content)

    with open(os.path.join(folder, "../js", f'{base_name}.js'), 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Processed: {base_name}.html")


def process_all_html_files(folder):
    for filename in os.listdir(folder):
        if filename.lower().endswith(".html"):
            split_html_file(os.path.join(folder, filename), folder)


# Run the script
folder_path = '.'   # 🔹 You can change this to any folder path
process_all_html_files(folder_path)

print("\n🎯 All HTML files processed successfully!")
