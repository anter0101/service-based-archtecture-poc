"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { getMe, listUsers } from "@dms/api-client";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dms/ui";

export function DashboardView() {
  const t = useTranslations("common");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const meQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: getMe,
  });

  const usersQuery = useQuery({
    queryKey: ["users", "list", page, pageSize],
    queryFn: () =>
      listUsers({ page, pageSize, sortField: "id", sortOrder: "ASC" }),
  });

  return (
    <div className="space-y-10">
      <section className="animate-rise space-y-3">
        <p className="text-primary font-display text-lg">{t("dashboard")}</p>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">
          {meQuery.isLoading && t("loading")}
          {meQuery.data && t("welcomeUser", { name: meQuery.data.name })}
          {meQuery.error && t("profileError")}
        </h1>
        {meQuery.data && (
          <dl className="text-ink-muted flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm">
            <div className="flex gap-2">
              <dt>ID</dt>
              <dd className="text-ink font-medium">{meQuery.data.id}</dd>
            </div>
            <div className="flex gap-2">
              <dt>Email</dt>
              <dd className="text-ink font-medium">{meQuery.data.email}</dd>
            </div>
          </dl>
        )}
        {meQuery.isLoading && <Skeleton className="h-8 w-64" />}
      </section>

      <section className="animate-rise-delay surface-panel overflow-hidden">
        <div className="flex items-end justify-between gap-4 border-b border-border/80 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl text-ink">{t("users")}</h2>
            <p className="text-ink-muted mt-1 text-sm">
              {usersQuery.data
                ? t("usersTotal", { count: usersQuery.data.totalCount })
                : t("loading")}
            </p>
          </div>
        </div>

        <div className="px-2 py-2 sm:px-4">
          {usersQuery.isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : usersQuery.data?.data.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-ink-muted">ID</TableHead>
                    <TableHead className="text-ink-muted">Name</TableHead>
                    <TableHead className="text-ink-muted">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersQuery.data.data.map((user) => (
                    <TableRow key={user.id} className="border-border/60">
                      <TableCell className="text-ink-muted">{user.id}</TableCell>
                      <TableCell className="font-medium text-ink">
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t("previous")}
                </Button>
                <span className="text-ink-muted text-sm">
                  {t("pageLabel", { page: usersQuery.data.currentPage })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!usersQuery.data.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("next")}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-ink-muted p-6 text-sm">{t("noData")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
