import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { formatPhone, stripPhone } from "../../util/phoneUtil";

export default function AddressSection({
    addresses: initialAddresses,
    selectedAddressId,
    onSelect,
    onAddAddress,
    showSelection = true,  // 주문 페이지에서는 true, 배송지 관리에서는 false
}) {
    const [addresses, setAddresses] = useState(initialAddresses ?? []);
    const [showNewForm, setShowNewForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // 수정 대상
    const [form, setForm] = useState({
        recipientName: "",
        recipientPhone: "",
        zipcode: "",
        address: "",
        addressDetail: "",
    });

    useEffect(() => {
        setAddresses(initialAddresses ?? []);
    }, [initialAddresses]);

    const resetForm = () => {
        setForm({ recipientName: "", recipientPhone: "", zipcode: "", address: "", addressDetail: "" });
        setShowNewForm(false);
        setEditTarget(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "recipientPhone") {
            setForm((prev) => ({ ...prev, recipientPhone: formatPhone(value) }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleZipcodeSearch = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                const fullAddress = data.roadAddress || data.jibunAddress;
                setForm((prev) => ({
                    ...prev,
                    zipcode: data.zonecode,
                    address: fullAddress,
                    addressDetail: "",
                }));
            },
        }).open();
    };

    // 추가
    const handleAdd = () => {
        if (!form.recipientName || !form.recipientPhone || !form.address) {
            alert("받는 분, 연락처, 주소는 필수 입력 항목입니다.");
            return;
        }

        axiosInstance.post("/members/addresses", {
            ...form,
            recipientPhone: stripPhone(form.recipientPhone), // ← DB 저장 시 하이픈 제거
            isDefault: false,
            memo: "",
        })
        .then((res) => {
            const newAddr = res.data;
            setAddresses((prev) => [...prev, newAddr]);
            onAddAddress?.(newAddr);
            onSelect?.(newAddr.addressId);
            resetForm();
        })
        .catch((err) => console.error("배송지 추가 실패:", err));
    };

    // 수정
    const handleEdit = (addr) => {
        setEditTarget(addr);
        setForm({
            recipientName: addr.recipientName,
            recipientPhone: formatPhone(addr.recipientPhone ?? ""), // ← 표시용 포맷
            zipcode: addr.zipcode,
            address: addr.address,
            addressDetail: addr.addressDetail,
        });
        setShowNewForm(false);
    };

    const handleEditSave = () => {
        if (!form.recipientName || !form.recipientPhone || !form.address) {
            alert("받는 분, 연락처, 주소는 필수 입력 항목입니다.");
            return;
        }

        axiosInstance.put(`/members/addresses/${editTarget.addressId}`, {
            ...form,
            recipientPhone: stripPhone(form.recipientPhone), // ← DB 저장 시 하이픈 제거
            isDefault: editTarget.default,
            memo: "",
        })
        .then((res) => {
            setAddresses((prev) =>
                prev.map((a) => a.addressId === editTarget.addressId ? res.data : a)
            );
            resetForm();
        })
        .catch((err) => console.error("배송지 수정 실패:", err));
    };

    // 삭제
    const handleDelete = (addressId) => {
        const target = addresses.find(a => a.addressId === addressId);
        if (target?.default) {
            alert("기본 배송지는 삭제할 수 없습니다.\n다른 배송지를 기본으로 설정 후 삭제해주세요.");
            return;
        }
        if (!window.confirm("배송지를 삭제하시겠습니까?")) return;

        axiosInstance.delete(`/members/addresses/${addressId}`)
        .then(() => {
            setAddresses((prev) => prev.filter((a) => a.addressId !== addressId));
            if (selectedAddressId === addressId) onSelect?.(null);
        })
        .catch((err) => console.error("배송지 삭제 실패:", err));
    };

    // 기본 배송지 변경
    const handleSetDefault = (addressId) => {
        axiosInstance.patch(`/members/addresses/${addressId}/default`)
        .then(() => {
            setAddresses((prev) =>
                prev.map((a) => ({ ...a, default: a.addressId === addressId }))
            );
        })
        .catch((err) => console.error("기본 배송지 변경 실패:", err));
    };

    // 폼 렌더
    const renderForm = (onSave, onCancel, saveLabel) => (
        <div className="border border-dashed border-gray-200 rounded p-4 mt-3 space-y-2">
            <div>
                <label className="text-xs text-gray-500 mb-1 block">받는 분</label>
                <input
                    type="text" name="recipientName" value={form.recipientName}
                    onChange={handleChange} placeholder="이름 입력"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400"
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">연락처</label>
                <input
                    type="text" name="recipientPhone" value={form.recipientPhone}
                    onChange={handleChange} placeholder="010-0000-0000"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400"
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">주소</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text" name="zipcode" value={form.zipcode}
                        placeholder="우편번호" readOnly
                        className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400"
                    />
                    <button
                        onClick={handleZipcodeSearch}
                        className="px-4 py-2 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        검색
                    </button>
                </div>
                <input
                    type="text" name="address" value={form.address}
                    placeholder="기본 주소" readOnly
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 mb-2"
                />
                <input
                    type="text" name="addressDetail" value={form.addressDetail}
                    onChange={handleChange} placeholder="상세 주소 입력"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400"
                />
            </div>
            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="text-xs px-3 py-1.5 border border-gray-300 rounded text-gray-400 hover:bg-gray-50 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={onSave}
                    className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    {saveLabel}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded p-5">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">배송지</h3>
                {/* 추가 버튼 비활성화 */}
                {!showNewForm && !editTarget && (
                    <button
                        onClick={() => {
                            if (addresses.length >= 5) {
                                alert("배송지는 최대 5개까지 등록할 수 있습니다.");
                                return;
                            }
                            setShowNewForm(true);
                        }}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        + 새 배송지 추가
                    </button>
                )}
            </div>

            {/* 새 배송지 추가 폼 */}
            {showNewForm && renderForm(handleAdd, resetForm, "저장")}

            {/* 배송지 목록 */}
            <div className="space-y-2 mt-3">
                {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-gray-200 rounded">
                        <p className="text-sm text-gray-400">등록된 배송지가 없습니다.</p>
                        <p className="text-xs text-gray-300 mt-1">
                            위의 <span className="text-gray-500 font-medium">+ 새 배송지 추가</span> 버튼을 눌러 등록해주세요.
                        </p>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div key={addr.addressId}>
                            <div
                                className={`flex items-start gap-3 p-3 border rounded transition-colors
                                    ${showSelection && selectedAddressId === addr.addressId
                                        ? "border-gray-800 bg-gray-50"
                                        : "border-gray-200 hover:bg-gray-50"}`}
                            >
                                {/* 라디오 버튼 — 주문 페이지에서만 표시 */}
                                {showSelection && (
                                    <input
                                        type="radio"
                                        name="address"
                                        value={addr.addressId}
                                        checked={selectedAddressId === addr.addressId}
                                        onChange={() => onSelect?.(addr.addressId)}
                                        className="mt-0.5 accent-gray-700"
                                    />
                                )}

                                {/* 주소 정보 */}
                                <div className="flex-1 text-sm">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-medium text-gray-800">{addr.recipientName}</span>
                                        {addr.default && (
                                            <span className="text-xs px-1.5 py-0.5 bg-gray-800 text-white rounded">기본</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs">{addr.address} {addr.addressDetail}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{formatPhone(addr.recipientPhone ?? "")}</p>
                                </div>

                                {/* 관리 버튼 */}
                                <div className="flex gap-1 flex-shrink-0">
                                    {!addr.default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.addressId)}
                                            className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 transition-colors whitespace-nowrap"
                                        >
                                            기본설정
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(addr)}
                                        className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.addressId)}
                                        className="text-xs px-2 py-1 border border-red-200 rounded text-red-400 hover:bg-red-50 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            {/* 수정 폼 */}
                            {editTarget?.addressId === addr.addressId &&
                                renderForm(handleEditSave, resetForm, "수정 완료")
                            }
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}