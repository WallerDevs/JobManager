import { Application, Comment, Document, User, ApplicationDocument } from "@prisma/client";

export type ApplicationWithDetails = Application & {
  comments: (Comment & { user: Pick<User, "id" | "name"> })[];
  documents: (ApplicationDocument & { document: Document })[];
};

export type ApplicationSummary = Pick<
  Application,
  "id" | "companyName" | "jobTitle" | "status" | "appliedAt" | "createdAt"
>;

export type SerializedApplicationSummary = {
  id: string;
  companyName: string;
  jobTitle: string;
  status: Application["status"];
  appliedAt: string | null;
  createdAt: string;
};

export type DocumentSummary = Pick<Document, "id" | "type" | "title" | "updatedAt">;

export type CreateApplicationInput = {
  companyName: string;
  jobTitle: string;
  description?: string;
  jobUrl?: string;
  location?: string;
  salary?: string;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput> & {
  status?: Application["status"];
  appliedAt?: string;
};

export type CreateDocumentInput = {
  type: Document["type"];
  title: string;
  content: string;
};

export type UpdateDocumentInput = Partial<CreateDocumentInput>;

export type CreateCommentInput = {
  applicationId: string;
  content: string;
};
