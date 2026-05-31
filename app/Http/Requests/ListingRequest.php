<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'   => 'required|exists:categories,id',
            'province_id'   => 'required|exists:provinces,id',
            'title'         => 'required|string|max:255',
            'description'   => 'required|string',
            'type'          => 'required|in:sale,rent',
            'price'         => 'required|numeric|min:0',
            'area'          => 'required|numeric|min:0',
            'address'       => 'required|string|max:255',
            'district'      => 'nullable|string|max:100',
            'bedrooms'      => 'nullable|integer|min:0',
            'bathrooms'     => 'nullable|integer|min:0',
            'floor'         => 'nullable|integer',
            'contact_name'  => 'required|string|max:100',
            'contact_phone' => 'required|string|max:15',
            'images'        => 'nullable|array|max:10',
            'images.*'      => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required'   => 'Vui lòng chọn loại BĐS',
            'province_id.required'   => 'Vui lòng chọn tỉnh/thành phố',
            'title.required'         => 'Tiêu đề không được để trống',
            'type.in'                => 'Loại tin phải là sale hoặc rent',
            'price.required'         => 'Vui lòng nhập giá',
            'area.required'          => 'Vui lòng nhập diện tích',
            'images.*.image'         => 'File phải là hình ảnh',
            'images.*.max'           => 'Ảnh tối đa 2MB',
        ];
    }
}