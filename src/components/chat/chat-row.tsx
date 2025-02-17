import { ChatRole } from "@/features/chat/chat-services/models";
import { cn } from "@/lib/utils";
import { FC } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Typography from "../typography";
import { Avatar, AvatarImage } from "../ui/avatar";
import { CodeBlock } from "./code-block";
import { MemoizedReactMarkdown } from "./memoized-react-markdown";
interface ChatRowProps {
  name: string;
  profilePicture: string;
  message: string;
  type: ChatRole;
}

const ChatRow: FC<ChatRowProps> = (props) => {
  return (
    <div
      className={cn(
        "border-b ",
        props.type === "assistant" ? "bg-primary/5" : ""
      )}
    >
      <div className="container mx-auto max-w-4xl py-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={props.profilePicture} />
            </Avatar>
            <Typography variant="h5" className="capitalize">
              {props.name}
            </Typography>
          </div>
        </div>
        <div className="py-6">
          <MemoizedReactMarkdown
            className="prose prose-slate dark:prose-invert break-words prose-p:leading-relaxed prose-pre:p-0 max-w-none"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == "▍") {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
                    );
                  }

                  children[0] = (children[0] as string).replace("`▍`", "▍");
                }

                const match = /language-(\w+)/.exec(className || "");

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                );
              },
            }}
          >
            {props.message}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatRow;
