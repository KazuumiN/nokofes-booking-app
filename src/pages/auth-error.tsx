import Link from 'next/link';

const AuthError = () => {
  return (
    <div>
      <h1>認証エラー</h1>
      <p>※メールの認証リンクは一度しか使えません。</p>
      <p className='text-2xl underline my-6'><Link href="/"><a>再度ログインする際は<br/>こちらをクリックしてください！</a></Link></p>
      <p>...または、一度閉じて、再度試してみてください。<br/>このエラーが複数回発生している場合は少々時間を置いて再度お試しください。</p>
    </div>
  )
}

export default AuthError
