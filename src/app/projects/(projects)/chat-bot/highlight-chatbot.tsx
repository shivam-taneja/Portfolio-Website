"use client";

import Link from "next/link";

import { useChatbotHighlight } from "@/provider/chatbot-highlight";

function HighlightChatbot() {
  const { highlight } = useChatbotHighlight();

  return (
    <ul className="flex list-disc ml-4 flex-col gap-2">
      <li className="relative w-fit">
        <button
          type="button"
          className="border-0 bg-transparent p-0 font-inherit cursor-pointer hover-animation"
          onClick={() => highlight()}
        >
          View Live Project
        </button>
      </li>

      <li className="relative w-fit">
        <Link
          href="https://github.com/shivam-taneja/Portfolio-Website/tree/design-v2"
          rel="noopener noreferrer"
          target="_blank"
          className="relative overflow-hidden"
          onClick={() => highlight()}
        >
          <span className="hover-animation">View source code</span>
        </Link>
      </li>
    </ul>
  );
}

export default HighlightChatbot;
