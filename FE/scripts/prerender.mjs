import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const serverEntry = resolve(root, '.prerender', 'entry-server.js');

// pdfjs is imported by the upload UI even though prerendered public pages never
// execute PDF parsing. Minimal constructors keep its module initialization safe
// in Node without adding a browser runtime to the build.
if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class DOMMatrix {};
if (!globalThis.Path2D) globalThis.Path2D = class Path2D {};
if (!globalThis.ImageData) globalThis.ImageData = class ImageData {};

const { render } = await import(pathToFileURL(serverEntry).href);
const shell = await readFile(resolve(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.c-checker.io.vn';

const pages = {
  '/': ['C-checker — Kiểm tra đạo văn tiếng Trung', 'C-checker giúp phát hiện trùng lặp và nguồn tham khảo trong văn bản tiếng Trung bằng so khớp ngữ nghĩa, LCS và N-gram.'],
  '/guide': ['Hướng dẫn sử dụng C-checker', 'Hướng dẫn nhập văn bản, tải tài liệu, theo dõi tiến trình và đọc báo cáo kiểm tra trùng lặp tiếng Trung trên C-checker.'],
  '/about': ['Giới thiệu C-checker', 'Tìm hiểu mục tiêu, phạm vi và các phương pháp MiniLM, LCS, N-gram được C-checker sử dụng để đối chiếu văn bản tiếng Trung.'],
  '/privacy': ['Chính sách bảo mật — C-checker', 'Thông tin về dữ liệu tài khoản, tài liệu tải lên, cookie, quảng cáo và quyền yêu cầu xóa dữ liệu tại C-checker.'],
  '/terms': ['Điều khoản dịch vụ — C-checker', 'Điều kiện sử dụng, giới hạn trách nhiệm và quyền của người dùng khi sử dụng dịch vụ C-checker.'],
  '/contact': ['Liên hệ C-checker', 'Kênh liên hệ hỗ trợ kỹ thuật, góp ý và gửi yêu cầu liên quan đến quyền riêng tư tại C-checker.'],
  '/kien-thuc': ['Kiến thức kiểm tra trùng lặp tiếng Trung — C-checker', 'Tài liệu chuyên sâu về cách đọc báo cáo, phương pháp, hạn chế và sai số khi kiểm tra trùng lặp tiếng Trung bằng C-checker.'],
  '/kien-thuc/huong-dan-doc-bao-cao': ['Hướng dẫn đọc báo cáo C-checker', 'Hiểu điểm trùng lặp toàn bài, điểm câu, LCS, N-gram, Semantic, Contiguous và cách kiểm chứng nguồn trong báo cáo C-checker.'],
  '/kien-thuc/han-che-va-sai-so': ['Hạn chế và sai số của C-checker', 'Tìm hiểu dương tính giả, âm tính giả, giới hạn nguồn và cách diễn giải có trách nhiệm kết quả kiểm tra của C-checker.'],
  '/kien-thuc/cach-nhan-biet-dao-van-tieng-trung': ['Cách nhận biết đạo văn tiếng Trung — C-checker', 'Nhận biết sao chép nguyên văn, diễn đạt lại hời hợt, sử dụng ý tưởng thiếu nguồn và cách kiểm tra văn bản tiếng Trung.'],
  '/kien-thuc/lcs-ngram-semantic-similarity': ['LCS, N-gram và Semantic Similarity trong C-checker', 'Giải thích cách C-checker kết hợp LCS, N-gram, MiniLM Semantic và Contiguous để tìm nguồn tương đồng tiếng Trung.'],
  '/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung': ['Vì sao kiểm tra tài liệu tiếng Trung khó? — C-checker', 'Những trở ngại về kho dữ liệu, quyền truy cập, token hóa và cách đánh giá tỷ lệ tương đồng trong tài liệu tiếng Trung.'],
};

const escapeAttr = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

for (const [route, [title, description]] of Object.entries(pages)) {
  const canonical = `${siteUrl}${route === '/' ? '/' : route}`;
  let html = shell
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeAttr(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*">/s, `<meta property="og:title" content="${escapeAttr(title)}">`)
    .replace(/<meta property="og:description"\s+content="[^"]*">/s, `<meta property="og:description" content="${escapeAttr(description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/s, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/s, `<meta name="twitter:title" content="${escapeAttr(title)}">`)
    .replace(/<meta name="twitter:description"\s+content="[^"]*">/s, `<meta name="twitter:description" content="${escapeAttr(description)}">`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${render(route)}</div>`);

  const output = route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
}

await rm(resolve(root, '.prerender'), { recursive: true, force: true });
console.log(`Prerendered ${Object.keys(pages).length} public routes.`);
