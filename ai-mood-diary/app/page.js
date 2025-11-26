// app/page.js
'use client'; // 这行告诉Next.js，这个文件里的代码会在浏览器里运行

import { useState } from 'react';

export default function MoodDiary() {
  // 这些是“状态”，用来记住用户输入和AI的回复
  const [date, setDate] = useState('');
  const [mood, setMood] = useState('happy');
  const [journal, setJournal] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 这个函数会在用户点击“分析我的情绪”按钮时被调用
  const analyzeMood = async () => {
    if (!journal) {
      alert('请先写点日记内容吧！');
      return;
    }

    setIsLoading(true); // 开始加载，让按钮变灰防止重复点击
    setAnalysis('AI正在思考...');

    try {
      // 向我们的“后端”发送请求
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          mood: mood,
          journal: journal,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data.analysis); // 显示AI的分析结果
      } else {
        throw new Error(data.error || '分析失败');
      }
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('抱歉，分析服务暂时不可用。请稍后再试。');
    } finally {
      setIsLoading(false); // 结束加载
    }
  };

  // 下面是网页上显示的内容
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📖 我的AI情绪日记本</h1>
      <p>记录每一天，让AI帮你更懂自己。</p>

      <div style={{ marginBottom: '15px' }}>
        <label>日期：</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>今日主导情绪：</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="happy">😊 开心</option>
          <option value="sad">😢 悲伤</option>
          <option value="angry">😠 愤怒</option>
          <option value="anxious">😰 焦虑</option>
          <option value="calm">😌 平静</option>
          <option value="tired">😴 疲惫</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>日记内容：</label>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="今天发生了什么？你有什么感受和想法？..."
          rows="5"
          style={{ width: '100%', marginTop: '10px', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={analyzeMood}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : '#0070f3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? '分析中...' : '🔍 分析我的情绪'}
      </button>

      {analysis && (
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h3>💡 AI视角分析：</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{analysis}</p>
        </div>
      )}
    </div>
  );
}