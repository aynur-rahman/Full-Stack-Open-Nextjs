import { RegisterForm } from '@/components/forms'
export const metadata = { title: 'Register' }
export default function Register() { return <section className="mx-auto max-w-lg"><p className="eyebrow">Make yourself at home</p><h1 className="page-title">Join the readers</h1><p className="mb-7 text-stone-600">Save what interests you and share what stays with you.</p><div className="panel"><RegisterForm /></div></section> }
