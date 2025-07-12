'use client'
// นำเข้า useEffect และ useRef จาก React
// Import useEffect and useRef from React
import { useEffect, useRef } from 'react'

// ประกาศชนิดข้อมูล (Props) ที่ Modal รับเข้ามา
// Define the type of props that Modal accepts
interface ModalProps {
    id?: string // รหัสประจำ modal (ไม่จำเป็น) / Modal id (optional)
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' // ขนาด modal (เล็ก-ใหญ่) / Modal size (small to extra large)
    title?: string // ข้อความหัว modal (ไม่จำเป็น) / Modal title (optional)
    children: React.ReactNode // เนื้อหาภายใน modal (ใส่อะไรก็ได้) / Content inside modal (can be anything)
    onClose: () => void // ฟังก์ชันที่เรียกเมื่อปิด modal / Function called when modal closes
}

// คอมโพเนนต์ Modal สำหรับแสดงกล่อง popup กลางจอ
// Modal component for showing a popup box in the center of the screen
const Modal = ({ id, size = 'md', title, children, onClose }: ModalProps) => {
    // ใช้ ref เพื่ออ้างอิงกล่อง modal สำหรับตรวจสอบการคลิกนอกกล่อง
    // Use ref to reference the modal box for detecting outside clicks
    const modalRef = useRef<HTMLDivElement>(null)

    // ตั้งค่า event เมื่อ modal ถูกเปิด (mount)
    // Set up events when modal is opened (mounted)
    useEffect(() => {
        // ถ้ากดปุ่ม Escape ให้ปิด modal
        // Close modal when Escape key is pressed
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        // ถ้าคลิกนอก modal ให้ปิด modal
        // Close modal when clicking outside the modal box
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        // เพิ่ม event listener สำหรับปุ่ม Escape และคลิกนอกกล่อง
        // Add event listeners for Escape key and outside click
        document.addEventListener('keydown', handleEscape)
        document.addEventListener('mousedown', handleClickOutside)

        // ลบ event listener เมื่อ modal ถูกปิด (unmount)
        // Remove event listeners when modal is closed (unmounted)
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    // กำหนดคลาสขนาด modal ตาม props ที่รับเข้ามา
    // Set modal size class based on the size prop
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-3xl',
        '3xl': 'max-w-4xl'
    }

    // โครงสร้างของ modal
    // Modal structure
    return (
        // พื้นหลังดำโปร่งใสและเบลอ (modal overlay)
        // Black transparent and blurred background (modal overlay)
        <div className="modal">
            {/* กล่อง modal จริงที่อยู่ตรงกลางจอ */}
            {/* The actual modal box in the center */}
            <div
                ref={modalRef}
                id={id}
                className={`${sizeClasses[size]} modal-container`}
            >
                {/* ส่วนหัว modal แสดงหัวข้อและปุ่มปิด */}
                {/* Modal header with title and close button */}
                <div className="modal-header">
                    <h3 className="modal-title">
                        {title}
                    </h3>
                    {/* ปุ่มกากบาทสำหรับปิด modal */}
                    {/* X button to close the modal */}
                    <button
                        onClick={onClose}
                        className="modal-close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {/* ส่วนเนื้อหา modal สามารถใส่ฟอร์ม, ข้อความ, ปุ่ม หรืออะไรก็ได้ */}
                {/* Modal body: put any content here (form, text, buttons, etc.) */}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal

/*
Usage Example / ตัวอย่างการใช้งาน:

<Modal 
    title="Example Modal"
    size="md"
    onClose={() => setIsOpen(false)}
>
    <div>
        <h1>Your content here</h1>
        <p>Add any content you want</p>
        <button>Action buttons</button>
    </div>
</Modal>

Features / คุณสมบัติ:
- Closes on: Escape key, outside click, close button
- Customizable size (sm, md, lg, xl, 2xl)
- Flexible content through children prop
- Optional title

Modal คือกล่อง popup ที่ลอยขึ้นมากลางจอ ใช้แสดงข้อความ ฟอร์ม หรืออะไรก็ได้
ปิดได้ 3 วิธี: กดปุ่ม X, กดปุ่ม Escape, หรือคลิกนอกกล่อง
ขนาดกล่องปรับได้ (sm, md, lg, xl, 2xl)
ใส่เนื้อหาอะไรก็ได้ตรง {children}
ต้องส่งฟังก์ชัน onClose เพื่อบอกว่าจะให้ modal หายไปเมื่อปิด
*/