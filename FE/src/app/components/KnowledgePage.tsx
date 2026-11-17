import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

interface ArticleItem {
  href: string;
  title: string;
  description: string;
  category: 'method' | 'citation' | 'standards' | 'linguistics';
  categoryLabel: string;
  readTime: string;
}

const articles: ArticleItem[] = [
  {
    href: '/kien-thuc/huong-dan-su-dung-c-checker-co-hinh-anh',
    title: 'Hướng dẫn sử dụng C-checker chi tiết từ A-Z (Kèm hình ảnh & Video)',
    description: 'Quy trình thực hành 4 giai đoạn với hình ảnh giao diện chi tiết, video mô phỏng thao tác nạp tài liệu và cách đọc báo cáo đối soát câu.',
    category: 'method',
    categoryLabel: 'HƯỚNG DẪN THỰC HÀNH',
    readTime: '10 phút đọc'
  },
  {
    href: '/kien-thuc/cach-giam-ty-le-trung-lap-ma-khong-lam-sai-y',
    title: 'Cách giảm tỷ lệ trùng lặp mà không làm sai ý bài viết',
    description: 'Quy trình 4 bước xử lý đoạn văn bị trùng lặp, kỹ thuật biến đổi câu tiếng Trung an toàn và cạm bẫy lách máy cần tránh.',
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP VIẾT',
    readTime: '9 phút đọc'
  },
  {
    href: '/kien-thuc/cach-trich-dan-tai-lieu-tieng-trung-theo-apa',
    title: 'Cách trích dẫn tài liệu tiếng Trung theo APA 7',
    description: 'Nguyên tắc trích dẫn nguồn chữ Hán theo chuẩn APA 7, phiên âm Pinyin, dịch nghĩa tiêu đề và ví dụ cho sách, báo, luận văn.',
    category: 'citation',
    categoryLabel: 'CHUẨN TRÍCH DẪN',
    readTime: '12 phút đọc'
  },
  {
    href: '/kien-thuc/cach-ghi-tai-lieu-tham-khao-tieng-trung-trong-luan-van-tieng-viet',
    title: 'Cách ghi tài liệu tham khảo tiếng Trung trong luận văn tiếng Việt',
    description: 'Hướng dẫn giữ chữ Hán, chọn phiên âm Hán Việt hay Pinyin, dịch tiêu đề và cách sắp xếp danh mục tài liệu chuẩn mực.',
    category: 'citation',
    categoryLabel: 'DANH MỤC THAM KHẢO',
    readTime: '10 phút đọc'
  },
  {
    href: '/kien-thuc/khi-nao-can-dat-ngoac-kep-khi-nao-chi-can-dan-nguon',
    title: 'Khi nào cần đặt ngoặc kép và khi nào chỉ cần dẫn nguồn?',
    description: 'Phân biệt trích dẫn nguyên văn và diễn giải (paraphrase), khi nào bắt buộc đặt ngoặc kép và cách tránh lỗi đạo văn vô ý.',
    category: 'citation',
    categoryLabel: 'CHUẨN TRÍCH DẪN',
    readTime: '7 phút đọc'
  },
  {
    href: '/kien-thuc/cach-trich-dan-nguon-thu-cap-dung-cach',
    title: 'Cách trích dẫn nguồn thứ cấp đúng cách',
    description: 'Khái niệm nguồn sơ cấp và thứ cấp, cách dùng "dẫn theo" (转引自 / as cited in) và các nguyên tắc trích dẫn gián tiếp.',
    category: 'citation',
    categoryLabel: 'CHUẨN TRÍCH DẪN',
    readTime: '8 phút đọc'
  },
  {
    href: '/kien-thuc/kien-thuc-pho-thong-co-can-trich-dan-khong',
    title: 'Kiến thức phổ thông có cần trích dẫn không?',
    description: 'Ba tiêu chí xác định kiến thức phổ thông (common knowledge), phân biệt sự thật hiển nhiên và dữ liệu nghiên cứu cần trích dẫn.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '6 phút đọc'
  },
  {
    href: '/kien-thuc/cach-quan-ly-tai-lieu-tham-khao-khi-viet-luan-van-tieng-trung',
    title: 'Cách quản lý tài liệu tham khảo khi viết luận văn tiếng Trung',
    description: 'Quy trình 5 bước quản lý nguồn tài liệu, phân biệt ba loại ghi chú và ứng dụng phần mềm Zotero/Mendeley với chữ Hán.',
    category: 'method',
    categoryLabel: 'CÔNG CỤ HỌC THUẬT',
    readTime: '11 phút đọc'
  },
  {
    href: '/kien-thuc/checklist-kiem-tra-luan-van-tieng-trung-truoc-khi-nop',
    title: 'Checklist kiểm tra luận văn tiếng Trung trước khi nộp',
    description: 'Danh sách rà soát trích dẫn, hệ chữ, cấu trúc, dữ liệu, định dạng và báo cáo tương đồng trước khi nộp bản cuối.',
    category: 'standards',
    categoryLabel: 'BẢNG KIỂM NỘP BÀI',
    readTime: '8 phút đọc'
  },
  {
    href: '/kien-thuc/cach-paraphrase-tieng-trung-dung-cach',
    title: 'Cách paraphrase tiếng Trung đúng cách và tránh đạo văn',
    description: 'Quy trình diễn đạt lại trung thành với nguồn, ví dụ tiếng Trung và những lỗi làm thay đổi ý cần tránh.',
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP VIẾT',
    readTime: '9 phút đọc'
  },
  {
    href: '/kien-thuc/cach-xu-ly-tung-cau-bi-c-checker-danh-dau',
    title: 'Cách xử lý từng câu bị C-checker đánh dấu',
    description: 'Cách chọn giữa giữ nguyên, bổ sung nguồn, paraphrase hoặc loại bỏ sau khi mở câu và nguồn đối chiếu.',
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP VIẾT',
    readTime: '8 phút đọc'
  },
  {
    href: '/kien-thuc/ty-le-tuong-dong-va-dao-van-khac-nhau-nhu-the-nao',
    title: 'Tỷ lệ tương đồng và đạo văn khác nhau như thế nào?',
    description: 'Vì sao phần trăm tương đồng là tín hiệu kỹ thuật chứ không phải tỷ lệ đạo văn hay phán quyết về ý định.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '7 phút đọc'
  },
  {
    href: '/kien-thuc/nhung-phan-nao-trong-luan-van-thuong-bi-bao-trung',
    title: 'Những phần nào trong luận văn thường bị báo trùng?',
    description: 'Cách đọc tương đồng ở tổng quan, định nghĩa, phương pháp, phụ lục, tài liệu tham khảo và phần kết quả.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '10 phút đọc'
  },
  {
    href: '/kien-thuc/xu-huong-nghien-cuu-ngon-ngu-van-hoa-trung-quoc',
    title: 'Xu hướng nghiên cứu ngôn ngữ và văn hóa Trung Quốc',
    description: 'Các hướng nghiên cứu nổi bật về khối liệu, AI, nhân văn số, mạng xã hội và ứng dụng xuyên ngành.',
    category: 'linguistics',
    categoryLabel: 'NGÔN NGỮ & KHỐI LIỆU',
    readTime: '13 phút đọc'
  },
  {
    href: '/kien-thuc/dao-van-vo-y-va-co-y',
    title: 'Phân biệt đạo văn vô ý và cố ý',
    description: 'Nhận biết khác biệt về ý định, những tình huống thường gặp và cách phòng tránh sai sót trích dẫn.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '8 phút đọc'
  },
  {
    href: '/kien-thuc/vi-sao-kiem-tra-dao-van-tieng-trung-kho-hon',
    title: 'Vì sao kiểm tra đạo văn tiếng Trung khó hơn?',
    description: 'So sánh tiếng Trung với tiếng Anh, tiếng Việt qua ranh giới từ, hệ chữ, cấu trúc câu và dữ liệu đối chiếu.',
    category: 'linguistics',
    categoryLabel: 'NGÔN NGỮ & KHỐI LIỆU',
    readTime: '11 phút đọc'
  },
  {
    href: '/kien-thuc/bao-nhieu-phan-tram-trung-lap-thi-yen-tam',
    title: 'Bao nhiêu % trùng lặp thì có thể yên tâm?',
    description: 'Các mốc tỷ lệ thường gặp, lý do không có một ngưỡng chung và quy trình đánh giá bài viết trước khi nộp.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '8 phút đọc'
  },
  {
    href: '/kien-thuc/cach-nhan-biet-dao-van-tieng-trung',
    title: 'Cách nhận biết đạo văn tiếng Trung',
    description: 'Các hình thức thường gặp, dấu hiệu cần kiểm tra, phương pháp đối chiếu thủ công và cách trích dẫn nguồn đúng.',
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP VIẾT',
    readTime: '9 phút đọc'
  },
  {
    href: '/kien-thuc/lcs-ngram-semantic-similarity',
    title: 'LCS, N-gram và Semantic Similarity trong C-checker',
    description: 'Tìm hiểu bốn chỉ số C-checker sử dụng, công thức tính điểm và cơ chế đối soát sâu văn bản tiếng Trung.',
    category: 'linguistics',
    categoryLabel: 'NGÔN NGỮ & KHỐI LIỆU',
    readTime: '10 phút đọc'
  },
  {
    href: '/kien-thuc/kho-khan-kiem-tra-dao-van-tieng-trung',
    title: 'Vì sao kiểm tra tài liệu tiếng Trung gặp nhiều trở ngại?',
    description: 'Khả năng tiếp cận kho học thuật, đặc điểm chữ Hán, nguồn dữ liệu đóng và vai trò phù hợp của C-checker.',
    category: 'linguistics',
    categoryLabel: 'NGÔN NGỮ & KHỐI LIỆU',
    readTime: '10 phút đọc'
  },
  {
    href: '/kien-thuc/huong-dan-doc-bao-cao',
    title: 'Hướng dẫn đọc báo cáo C-checker chi tiết',
    description: 'Hiểu kết luận toàn bài, điểm câu cao nhất, các chỉ số LCS, N-gram, Semantic, Contiguous và cách kiểm tra nguồn nghi ngờ.',
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP VIẾT',
    readTime: '9 phút đọc'
  },
  {
    href: '/kien-thuc/han-che-va-sai-so',
    title: 'Hạn chế và sai số kỹ thuật của C-checker',
    description: 'Những trường hợp có thể tạo dương tính giả, âm tính giả và cách sử dụng kết quả kiểm tra một cách có trách nhiệm.',
    category: 'standards',
    categoryLabel: 'QUY ĐỊNH HỌC THUẬT',
    readTime: '9 phút đọc'
  },
];

export function KnowledgePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="c-page-layout">
      <div className="c-page-container">
        <button className="c-page-back-btn" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </button>

        <header className="c-page-hero">
          <div className="c-seal-mark" style={{ marginBottom: 16 }}>
            <span className="c-seal-text">考证</span>
            <span className="c-seal-sub">KHO TRI THỨC HÁN HỌC</span>
          </div>
          <h1 className="c-page-title">Chuyên đề nghiên cứu &amp; Cẩm nang học thuật</h1>
          <p className="c-page-subtitle">
            Hệ thống 22 bài khảo cứu &amp; cẩm nang thực hành chuyên sâu về quy trình kiểm tra đối soát, quy chuẩn trích dẫn APA 7, kỹ thuật paraphrase Hán ngữ và giải mã báo cáo tương đồng.
          </p>

          {/* Category Filter Pills */}
          <div className="c-knowledge-filter-bar">
            <button
              type="button"
              className={`c-filter-pill ${activeCategory === 'all' ? 'c-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất cả chuyên đề ({articles.length})
            </button>
            <button
              type="button"
              className={`c-filter-pill ${activeCategory === 'citation' ? 'c-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory('citation')}
            >
              Chuẩn trích dẫn APA
            </button>
            <button
              type="button"
              className={`c-filter-pill ${activeCategory === 'method' ? 'c-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory('method')}
            >
              Phương pháp &amp; Paraphrase
            </button>
            <button
              type="button"
              className={`c-filter-pill ${activeCategory === 'standards' ? 'c-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory('standards')}
            >
              Quy định &amp; Ngưỡng %
            </button>
            <button
              type="button"
              className={`c-filter-pill ${activeCategory === 'linguistics' ? 'c-filter-pill--active' : ''}`}
              onClick={() => setActiveCategory('linguistics')}
            >
              Ngôn ngữ &amp; Thuật toán
            </button>
          </div>
        </header>

        <div className="c-knowledge-grid">
          {filteredArticles.map((article) => (
            <article className="c-knowledge-card" key={article.href}>
              <div className="c-knowledge-card-top">
                <span className="c-knowledge-tag">{article.categoryLabel}</span>
                <span className="c-knowledge-time">{article.readTime}</span>
              </div>
              <h2 className="c-knowledge-card-title">
                <Link to={article.href}>{article.title}</Link>
              </h2>
              <p className="c-knowledge-card-desc">{article.description}</p>
              <div className="c-knowledge-card-foot">
                <Link to={article.href} className="c-knowledge-card-link">
                  Đọc chuyên đề →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
