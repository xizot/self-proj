'use client';

import { submitGoogleForm, type GoogleFormData } from '@/utils';
import { CheckSquare, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from 'shared-ui';
import { Combobox } from 'shared-ui/client';

export default function SprintReportPage() {
  const [formData, setFormData] = useState<GoogleFormData>({
    fullName: '',
    team: '3',
    chuyenCan: '10',
    nangSuat: '10',
    thaiDo: '10',
    chuyenMon: '10',
    phatTrien: '10',
    sprintTruoc: '',
    diemManh: 'Hoàn thành các task được giao, tham gia code review, hỗ trợ team members khi cần',
    caiThien: '',
    hoTro: 'Không có',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedSprint, setSelectedSprint] = useState<string>('12');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Generate sprint options (1-20)
  const sprintOptions = Array.from({ length: 20 }, (_, i) => i + 1).map((num) => ({
    id: String(num),
    name: `Sprint ${num}`,
  }));

  // User options - bạn có thể cập nhật danh sách này
  const userOptions = [
    { id: 'currentUser', name: 'Current User' },
    // Thêm các user khác nếu cần
  ];

  // Fetch tasks when user or sprint changes
  useEffect(() => {
    if (selectedUser && selectedSprint) {
      fetchTasks(selectedUser, selectedSprint);
    }
  }, [selectedUser, selectedSprint]);

  const fetchTasks = async (user: string, sprint: string) => {
    setIsLoadingTasks(true);
    try {
      const response = await fetch(
        `/api/jira/tasks?user=${encodeURIComponent(user)}&sprint=${encodeURIComponent(sprint)}`
      );
      const data = await response.json();

      if (data.success && data.data?.tasksText) {
        setFormData((prev) => ({
          ...prev,
          sprintTruoc: data.data.tasksText,
        }));
      } else {
        console.error('Failed to fetch tasks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitGoogleForm(formData);
      setSubmitResult({
        success: result.success,
        message: result.success ? result.message : result.error,
      });

      if (result.success) {
        // Reset form after successful submission (keep default values)
        setFormData({
          fullName: '',
          team: '3',
          chuyenCan: '10',
          nangSuat: '10',
          thaiDo: '10',
          chuyenMon: '10',
          phatTrien: '10',
          sprintTruoc: '',
          diemManh:
            'Giao tiếp tốt, làm việc nhóm hiệu quả, chủ động trong công việc, hoàn thành các task được giao trước deadline.',
          caiThien: '',
          hoTro: 'Không có',
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <label
            key={num}
            className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-sm transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-primary/5 ${
              value === String(num) ? 'border-primary bg-primary/10 text-primary' : 'border-border'
            }`}
          >
            <input
              type="radio"
              name={label}
              value={String(num)}
              checked={value === String(num)}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            {num}
          </label>
        ))}
      </div>
    </div>
  );

  const isFormValid =
    formData.fullName.trim() &&
    formData.team &&
    formData.chuyenCan &&
    formData.nangSuat &&
    formData.thaiDo &&
    formData.chuyenMon &&
    formData.phatTrien;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Form Tự Đánh Giá Nhân Viên
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Vui lòng đánh giá bản thân theo thang điểm 1-10
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Jira Task Selector */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chọn User</label>
                      <Combobox
                        options={userOptions}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        placeholder="Chọn user..."
                        searchPlaceholder="Tìm user..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chọn Sprint</label>
                      <Combobox
                        options={sprintOptions}
                        value={selectedSprint}
                        onChange={setSelectedSprint}
                        placeholder="Chọn sprint..."
                        searchPlaceholder="Tìm sprint..."
                      />
                    </div>
                  </div>
                  {isLoadingTasks && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải tasks...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Họ và tên */}
              <div className="space-y-3">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Họ và tên <span className="text-destructive">*</span>
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Team */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Bạn thuộc team nào? <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3].map((teamNum) => (
                    <label
                      key={teamNum}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all duration-200 hover:scale-105 hover:border-primary/50 hover:bg-primary/5 ${
                        formData.team === String(teamNum)
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="team"
                        value={String(teamNum)}
                        checked={formData.team === String(teamNum)}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm">Team {teamNum}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Questions */}
              <div className="space-y-6 border-t pt-6">
                <RatingField
                  label="1. CHUYÊN CẦN — Tuân thủ giờ giấc, đúng giờ tới/ra"
                  value={formData.chuyenCan}
                  onChange={(value) => setFormData({ ...formData, chuyenCan: value })}
                />
                <RatingField
                  label="2. NĂNG SUẤT & THỜI GIAN — Hoàn thành deadline, tốc độ xử lý"
                  value={formData.nangSuat}
                  onChange={(value) => setFormData({ ...formData, nangSuat: value })}
                />
                <RatingField
                  label="3. THÁI ĐỘ & KỸ NĂNG MỀM — Hợp tác, giao tiếp, chủ động"
                  value={formData.thaiDo}
                  onChange={(value) => setFormData({ ...formData, thaiDo: value })}
                />
                <RatingField
                  label="4. CHUYÊN MÔN — Kỹ năng nghiệp vụ, chất lượng công việc"
                  value={formData.chuyenMon}
                  onChange={(value) => setFormData({ ...formData, chuyenMon: value })}
                />
                <RatingField
                  label="5. PHÁT TRIỂN — Học hỏi, cải tiến, tham gia chia sẻ"
                  value={formData.phatTrien}
                  onChange={(value) => setFormData({ ...formData, phatTrien: value })}
                />
              </div>

              {/* Optional Text Areas */}
              <div className="space-y-6 border-t pt-6">
                <div className="space-y-3">
                  <label htmlFor="sprintTruoc" className="text-sm font-medium">
                    Những phần đã thực hiện trong Sprint trước
                  </label>
                  <textarea
                    id="sprintTruoc"
                    rows={4}
                    placeholder="Mô tả những phần bạn đã thực hiện trong Sprint trước... (hoặc chọn user và sprint ở trên để tự động điền)"
                    value={formData.sprintTruoc}
                    onChange={(e) => setFormData({ ...formData, sprintTruoc: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="diemManh" className="text-sm font-medium">
                    Điểm mạnh nổi bật của tôi trong kỳ đánh giá này
                  </label>
                  <textarea
                    id="diemManh"
                    rows={4}
                    placeholder="Mô tả điểm mạnh của bạn..."
                    value={formData.diemManh}
                    onChange={(e) => setFormData({ ...formData, diemManh: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="caiThien" className="text-sm font-medium">
                    Điều tôi sẽ cải thiện trong kỳ tới
                  </label>
                  <textarea
                    id="caiThien"
                    rows={4}
                    placeholder="Mô tả những điều bạn sẽ cải thiện..."
                    value={formData.caiThien}
                    onChange={(e) => setFormData({ ...formData, caiThien: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="hoTro" className="text-sm font-medium">
                    Tôi cần hỗ trợ gì từ team/lead?
                  </label>
                  <textarea
                    id="hoTro"
                    rows={4}
                    placeholder="Mô tả những hỗ trợ bạn cần..."
                    value={formData.hoTro}
                    onChange={(e) => setFormData({ ...formData, hoTro: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi'
                )}
              </Button>

              {/* Result message */}
              {submitResult && (
                <div
                  className={`rounded-lg border p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                    submitResult.success
                      ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100'
                      : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100'
                  }`}
                >
                  <p className="text-sm font-medium">{submitResult.message}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
