'use client';

interface Props {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { emoji: '🧠', text: '¿Cuánto es 5 + 5?' },
  { emoji: '🌍', text: '¿Cuál es el país más grande?' },
  { emoji: '🚀', text: '¿Qué es la IA?' },
  { emoji: '⭐', text: 'Cuéntame una curiosidad' },
];

export default function Suggestions({ onSuggestion }: Props) {
  return (
    <div className="fixed bottom-[110px] left-[250px] right-[10px] max-w-[800px] mx-auto px-4 py-4">
      <h1 className="welcome-title relative text-center block text-[2.5rem] font-extralight leading-[1.1] text-gray-800 pb-10">
        Hola<br />¿En qué puedo ayudarte?
        <span className="w-full absolute flex justify-center block">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="311" height="16" viewBox="0 0 311 16" fill="none">
            <mask id="mask0_1552_2763" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="311" height="16">
              <path d="M0 0H311V16H0V0Z" fill="url(#pattern0)"/>
            </mask>
            <g mask="url(#mask0_1552_2763)">
              <path d="M0 0H311V16H0V0Z" fill="#9A4292"/>
            </g>
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_1552_2763" transform="scale(0.00337 0.05556)"/>
              </pattern>
              <image id="image0_1552_2763" width="297" height="18" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASkAAAASCAYAAAAHUyhYAAAQxklEQVR4Ae3cBbBmxREFYGJAiBAIBEIqCQkJcVfiQtxDhLgrcXeFuLu7u7u7u7u1Wd1Pc4XfUvC+HxtorardxXNXXvnTvT09N9+kzP3H93u+1W/pKcMMnVkuyzUr3cLhZYLLCNWSDJMZQjUzvJbkmOl2TPJKdOcqEkF+310uUD18snuVKSSya5YpIbJLlZkqv33bWSHJjkeklul+QuLfdJct8kD0pyhyQ3TnLH3t8vyU2SXCfJNZNcv/2NcZxNdE+ye5KHJ/llkr8k+XOSHyV5dZLrJqHk3km236Tj8rBYYLHAFlkgyTFbjp1EOdZ6BQrkJKdPcqkGPdK4VRLBf48kj07ypCRPSPLuJB9L8uEkP07y0yTfTfKvxvxvkvwqyQ+T/KLvtfl1636e5PdJfpbkT0n+WJ74RxLl30n+ulL3tyR/SPL3JO71wSuuc//b9tFfG/JHFj33WrNFGffFOfSP0j9o+X4nQRAByn+SeKb8l5I8L8nDagiMiWkx8clbdmD49Rp9abdY4Oi2QJLjGhM5NJs4SZKTJjlDy5mSnLX3+zTb8N7CrpyAjBKMbERbcWBHIkOQKdy5JCJWnp/kmb2+oLGDSNy/MslLkjwrySuSvDnJm0owP0nyvSTiEkEgFLGICMSjpEIbZCLZQDrukY737vVBQNpNnbbqtf9dC7LQXlskNW3da2NM7YfY1Csz7rwnRxukpE5furunu/fukdcU7xV/iGpPzrlglTbJIShk9bUk3yhRfTnJZ5J8MskXS1DfbD9tGc6gij6YmmImaXBsqv6Dzc4eVcY39kWaQl4hyZmTnDLJfgUFp+/Uleb4Q3jrSWOPbrAv4x2+BZLs2BXfluLEPVLgS8U7gb53iUJmsEfv90hyxiRn6fbDduIaSa7cLYHthq3FbZPculuMmzbzv2HxdZsk6m6e5OAkD2128ZriGN4FPiwL5q+0Hsbdq7cYw/9XGxOwPvcCUNyIAcEmCxBgglEATnB+p+2GNLQfEhArZGiPDOiERGQsnt1ro1479UMy7r0jzzuFXPXuvSMDCekzdTOmd4hFmezJPcIxN3UjdwjI3IasxLt78o2rzRCTuiE0dWMT17kfG+GIISc7Offs6e8gJGX/qdEYiEERlCvDMMCHSlKI6gt13Kfr0G8l+Wjfu74nySdWyIzDOZXDyft6xzIeY5qcwoiMYqLau2dM7/7ZtgDFKOrcAxby+3yST5UEX1UwPjDJM5IgRPvhByS5e5Jbdv97mZLjxZNcoOV8DQwptHKabnORpb37ibp/X8sQN0qWK6swebJOq7VV2r1t9emSnErAtu2uSXbp+BPcG8pQqz9yML9zdTFwBnC51l22ZODZYuF6iWbIV+35A3Jgy0c26B+T5P5J7l3bvyiJIht4W5LXJXlD/ePZ1oO/+BkYZemIQED4G/APuGECFrSBI9iAT0QCT7Dw7W5nPJMLl7Dr6r32MOaKaBT32g85edZ+FueROxg2vvbaGMOY5NBNzHgPk9oo+tPBvbb6GUN7z4r25iOozY0u5CBHz9qTQZaY0VedZ3FgfDLIopMY02bii2yFbbVhg1XCYtvVot+MQw55xhCrYk9buk4f9zOG65CQ96tkxJf8yt+rBSkNMSEnxK6te38HIKmD+mDilDF5xjFxxhogfK7gAjJEZH/7riTvTfLOPn88yUdKUEgMWXmWtmlPFjnaKeQAq/rPtgz5Mbg6xMi5+pGjTkbnmSNnpVOnr3kgUu/pD3BAYozV+dHLikp/8wVEsumM9NxrQyYd3X+gOr89yVuTvDzJ+yuDHPVsot20MW9GH0ANMDmfbmQbw5h0Nr4689F3xnRvXvSyGLCftmxCB30..."/>
            </defs>
          </svg>
        </span>
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(`${s.emoji} ${s.text}`)}
            className="py-4 px-5 bg-white hover:bg-gray-200 rounded-full border border-gray-100 transition"
          >
            {s.emoji} {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
