import { Link, useNavigate } from 'react-router';

const articles = [
  {
    href: '/kien-thuc/cach-nhan-biet-dao-van-tieng-trung',
    icon: '🔎',
    title: 'Cách nhận biết đạo văn tiếng Trung',
    description: 'Các hình thức thường gặp, dấu hiệu cần kiểm tra, phương pháp đối chiếu thủ công và cách trích dẫn nguồn đúng.',
    readingTime: '10 phút đọc',
  },
  {
    href: '/kien-thuc/lcs-ngram-semantic-similarity',
    icon: '🧠',
    title: 'LCS, N-gram và Semantic Similarity',
    description: 'Tìm hiểu bốn chỉ số C-checker sử dụng, công thức điểm Final và những công đoạn khiến một lượt kiểm tra cần thời gian.',
    readingTime: '9 phút đọc',
  },
  {
    href: '/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung',
    icon: '🀄',
    title: 'Vì sao kiểm tra tài liệu tiếng Trung khó?',
    description: 'Khả năng tiếp cận kho học thuật, đặc điểm chữ Hán, nguồn dữ liệu đóng và vai trò phù hợp của C-checker.',
    readingTime: '8 phút đọc',
  },
  {
    href: '/kien-thuc/huong-dan-doc-bao-cao',
    icon: '📊',
    title: 'Hướng dẫn đọc báo cáo C-checker',
    description: 'Hiểu kết luận toàn bài, điểm câu cao nhất, các chỉ số LCS, N-gram, Semantic, Contiguous và cách kiểm tra nguồn nghi ngờ.',
    readingTime: '10 phút đọc',
  },
  {
    href: '/kien-thuc/han-che-va-sai-so',
    icon: '⚖️',
    title: 'Hạn chế và sai số của C-checker',
    description: 'Những trường hợp có thể tạo dương tính giả, âm tính giả và cách sử dụng kết quả kiểm tra một cách có trách nhiệm.',
    readingTime: '9 phút đọc',
  },
];

export function KnowledgePage() {
  const navigate = useNavigate();

  return (
    <div className="c-page-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/')}>
          <span aria-hidden="true">←</span> Quay lại trang chủ
        </button>

        <header className="c-page-hero">
          <div className="c-page-hero-badge">Thư viện C-checker</div>
          <h1 className="c-page-title">Kiến thức về kiểm tra trùng lặp tiếng Trung</h1>
          <p className="c-page-subtitle">
            Tài liệu giúp bạn hiểu cách hệ thống hoạt động, đọc kết quả đúng ngữ cảnh và tránh xem một tỷ lệ tương đồng như bằng chứng duy nhất về đạo văn.
          </p>
        </header>

        <div className="c-knowledge-grid">
          {articles.map((article) => (
            <article className="c-knowledge-card" key={article.href}>
              <div className="c-knowledge-icon" aria-hidden="true">{article.icon}</div>
              <div className="c-knowledge-meta">Cập nhật 01/09/2026 · {article.readingTime}</div>
              <h2><Link to={article.href}>{article.title}</Link></h2>
              <p>{article.description}</p>
              <Link className="c-knowledge-link" to={article.href}>Đọc bài viết →</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
