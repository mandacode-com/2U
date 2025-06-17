export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6 relative">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center max-w-2xl leading-snug mb-10">
        당신의 마음을 소중한 사람에게 전하세요
      </h1>

      <p className="text-xs sm:text-xs text-gray-600 text-center max-w-2xl mb-8">
        당신의 마음을 담은 메시지를 남기고, 소중한 사람들과 공유해보세요.
        <br />
        비밀번호로 보호된 메시지는 오직 당신과 선택한 사람만 볼 수 있습니다.
      </p>
    </main>
  );
}
