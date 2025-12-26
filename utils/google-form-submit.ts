/**
 * Google Form submission data structure
 */
export interface GoogleFormData {
  fullName: string; // Họ và tên
  team: string; // Bạn thuộc team nào? (1, 2, 3)
  chuyenCan: string; // 1. CHUYÊN CẦN (1-10)
  nangSuat: string; // 2. NĂNG SUẤT & THỜI GIAN (1-10)
  thaiDo: string; // 3. THÁI ĐỘ & KỸ NĂNG MỀM (1-10)
  chuyenMon: string; // 4. CHUYÊN MÔN (1-10)
  phatTrien: string; // 5. PHÁT TRIỂN (1-10)
  sprintTruoc?: string; // Những phần đã thực hiện trong Sprint trước
  diemManh?: string; // Điểm mạnh nổi bật của tôi trong kỳ đánh giá này
  caiThien?: string; // Điều tôi sẽ cải thiện trong kỳ tới
  hoTro?: string; // Tôi cần hỗ trợ gì từ team/lead?
}

/**
 * Google Form submission result
 */
export interface GoogleFormSubmitResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Google Form configuration
 */
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdsBPsgedDcO3zGxJ03DnmOaLI8LXLdb-CybvHz4LsP0ft5Tg/formResponse',
  entryIds: {
    fullName: 'entry.221787527',
    team: 'entry.894110142',
    chuyenCan: 'entry.451537190',
    nangSuat: 'entry.627598011',
    thaiDo: 'entry.69451216',
    chuyenMon: 'entry.526753425',
    phatTrien: 'entry.439523387',
    sprintTruoc: 'entry.1859607613',
    diemManh: 'entry.723431251',
    caiThien: 'entry.1509788573',
    hoTro: 'entry.1148135990',
  },
  fbzx: '-3230780284575003309',
} as const;

/**
 * Validate form data before submission
 */
function validateFormData(data: GoogleFormData): { valid: boolean; error?: string } {
  if (!data.fullName || data.fullName.trim() === '') {
    return { valid: false, error: 'Họ và tên là bắt buộc' };
  }
  if (!data.team || !['1', '2', '3'].includes(data.team)) {
    return { valid: false, error: 'Vui lòng chọn team' };
  }
  const ratings = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  if (!data.chuyenCan || !ratings.includes(data.chuyenCan)) {
    return { valid: false, error: 'Vui lòng đánh giá CHUYÊN CẦN (1-10)' };
  }
  if (!data.nangSuat || !ratings.includes(data.nangSuat)) {
    return { valid: false, error: 'Vui lòng đánh giá NĂNG SUẤT & THỜI GIAN (1-10)' };
  }
  if (!data.thaiDo || !ratings.includes(data.thaiDo)) {
    return { valid: false, error: 'Vui lòng đánh giá THÁI ĐỘ & KỸ NĂNG MỀM (1-10)' };
  }
  if (!data.chuyenMon || !ratings.includes(data.chuyenMon)) {
    return { valid: false, error: 'Vui lòng đánh giá CHUYÊN MÔN (1-10)' };
  }
  if (!data.phatTrien || !ratings.includes(data.phatTrien)) {
    return { valid: false, error: 'Vui lòng đánh giá PHÁT TRIỂN (1-10)' };
  }
  return { valid: true };
}

/**
 * Submit Google Form with provided data
 *
 * @param data - Form data containing all required and optional fields
 * @returns Promise resolving to submission result
 *
 * @example
 * ```ts
 * const result = await submitGoogleForm({
 *   fullName: 'Nguyễn Văn A',
 *   team: '1',
 *   chuyenCan: '8',
 *   nangSuat: '9',
 *   thaiDo: '8',
 *   chuyenMon: '9',
 *   phatTrien: '8',
 *   sprintTruoc: 'Đã hoàn thành feature X',
 *   diemManh: 'Giao tiếp tốt',
 *   caiThien: 'Cải thiện tốc độ code',
 *   hoTro: 'Cần hỗ trợ về testing'
 * });
 * ```
 */
export async function submitGoogleForm(
  data: GoogleFormData
): Promise<GoogleFormSubmitResult> {
  // Validate input data
  const validation = validateFormData(data);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    // Create FormData with all required fields
    const formData = new FormData();

    // Required fields
    formData.append(GOOGLE_FORM_CONFIG.entryIds.fullName, data.fullName.trim());
    formData.append(GOOGLE_FORM_CONFIG.entryIds.team, data.team);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.team}_sentinel`, '');

    formData.append(GOOGLE_FORM_CONFIG.entryIds.chuyenCan, data.chuyenCan);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.chuyenCan}_sentinel`, '');

    formData.append(GOOGLE_FORM_CONFIG.entryIds.nangSuat, data.nangSuat);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.nangSuat}_sentinel`, '');

    formData.append(GOOGLE_FORM_CONFIG.entryIds.thaiDo, data.thaiDo);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.thaiDo}_sentinel`, '');

    formData.append(GOOGLE_FORM_CONFIG.entryIds.chuyenMon, data.chuyenMon);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.chuyenMon}_sentinel`, '');

    formData.append(GOOGLE_FORM_CONFIG.entryIds.phatTrien, data.phatTrien);
    formData.append(`${GOOGLE_FORM_CONFIG.entryIds.phatTrien}_sentinel`, '');

    // Optional fields
    if (data.sprintTruoc?.trim()) {
      formData.append(GOOGLE_FORM_CONFIG.entryIds.sprintTruoc, data.sprintTruoc.trim());
    }
    if (data.diemManh?.trim()) {
      formData.append(GOOGLE_FORM_CONFIG.entryIds.diemManh, data.diemManh.trim());
    }
    if (data.caiThien?.trim()) {
      formData.append(GOOGLE_FORM_CONFIG.entryIds.caiThien, data.caiThien.trim());
    }
    if (data.hoTro?.trim()) {
      formData.append(GOOGLE_FORM_CONFIG.entryIds.hoTro, data.hoTro.trim());
    }

    // Required hidden fields for Google Forms
    formData.append('fvv', '1');
    formData.append('partialResponse', `[null,null,"${GOOGLE_FORM_CONFIG.fbzx}"]`);
    formData.append('pageHistory', '0');
    formData.append('fbzx', GOOGLE_FORM_CONFIG.fbzx);
    formData.append('submissionTimestamp', Date.now().toString());

    // Submit form
    const response = await fetch(GOOGLE_FORM_CONFIG.formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Google Forms doesn't return CORS headers, so we use no-cors
    });

    // With no-cors mode, we can't check response status
    // If fetch completes without throwing, assume success
    return {
      success: true,
      message: 'Form đã được gửi thành công',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
    };
  }
}
