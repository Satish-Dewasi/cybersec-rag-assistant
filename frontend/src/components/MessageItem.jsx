import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageItem = React.memo(({ msg }) => {
  return (
    <div
      className={`flex ${
        msg.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {/* ASSISTANT MESSAGE */}
      {msg.role === "assistant" && (
        <div className="max-w-[85%] text-[15px]">
          {/* SOURCES HEADER */}
          {msg.citations?.length > 0 && !msg.loading && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Sources
              </div>
              <div className="flex flex-wrap gap-2">
                {msg.citations.map((source, index) => {
                  let url = "#";

                  // CVE Link
                  if (source.startsWith("CVE-")) {
                    url = `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${source}`;
                  }

                  // MITRE Technique Link
                  else if (/^T\d{4}(\.\d{3})?$/.test(source)) {
                    url = `https://attack.mitre.org/techniques/${source}/`;
                  }

                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-blue-400 text-xs rounded-md transition font-mono"
                    >
                      {source}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* LOADING BUBBLES */}
          {msg.loading ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
            </div>
          ) : (
            <>
              {/* MARKDOWN RENDERING */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-8 mb-3 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-6 mb-2 text-white">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 leading-7 mb-3">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-4">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="ml-5 list-disc text-gray-300">{children}</li>
                  ),
                  strong: ({ children }) => {
                    const text = children?.toString();
                    const techniqueMatch = text?.match(/T\d{4}\.\d{3}|T\d{4}/);

                    if (techniqueMatch) {
                      const techniqueId = techniqueMatch[0];
                      const cleaned = text.replace(techniqueId, "").trim();

                      return (
                        <span className="font-semibold text-white">
                          {cleaned && <span>{cleaned} </span>}
                          <span className="px-2 py-1 bg-gray-800 text-blue-400 rounded-md text-xs font-mono">
                            {techniqueId}
                          </span>
                        </span>
                      );
                    }

                    return (
                      <span className="font-semibold text-white">
                        {children}
                      </span>
                    );
                  },
                  hr: () => <div className="border-t border-gray-700 my-6" />,
                }}
              >
                {msg.content}
              </ReactMarkdown>

              {/* CONFIDENCE BADGE */}
              {msg.confidence != null && (
                <div className="mt-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      msg.confidence > 75
                        ? "bg-green-900/40 text-green-400"
                        : msg.confidence > 50
                          ? "bg-yellow-900/40 text-yellow-400"
                          : "bg-red-900/40 text-red-400"
                    }`}
                  >
                    Confidence: {msg.confidence.toFixed(1)}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* USER MESSAGE */}
      {msg.role === "user" && (
        <div className="bg-[#2f2f2f] px-4 py-2 rounded-2xl max-w-[75%]">
          {msg.content}
        </div>
      )}
    </div>
  );
});

export default MessageItem;
