import { NoteCard } from "../components/NoteCard";
import { useContent, type content, type customTag } from "../hooks/useContent";

function ContentArea() {
    const contents: content[] = useContent();
    const date = new Date();
  
    return (
      <div className="flex flex-col gap-4 p-4 overflow-y-auto bg-transparent">
        {contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow-md">
            {contents.map((content: content, index: number) => (
              <div
                key={content._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <NoteCard
                  title={content.title}
                  titleIcon={content.type}
                  body={{ type: content.type, link: content.link }}
                  date={date}
                  tags={
                    Array.isArray(content.tags)
                      ? (content.tags as customTag[]).map((tag) => tag.title ?? "")
                      : []
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg font-medium">No content available</p>
            <p className="text-sm">Click "Add content" to start adding notes!</p>
          </div>
        )}
      </div>
    );
  }
  

export function SharedPage(){
    return <div>
        <ContentArea/>
    </div>
}