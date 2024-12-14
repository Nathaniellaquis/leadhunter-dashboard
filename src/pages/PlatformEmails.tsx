import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const PlatformEmails: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const { accessToken, userData } = useAuth();
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [queries, setQueries] = useState<string[]>(['']);
  const [targetEmailCount, setTargetEmailCount] = useState<number | ''>('');
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);

  useEffect(() => {
    // If userData is already available and has creditsRemaining
    if (userData && typeof userData.creditsRemaining === 'number') {
      setCreditsRemaining(userData.creditsRemaining);
    } else {
      // If not available in userData, fetch user data
      if (accessToken && userData?.uid) {
        axios.get(`${API_BASE_URL}/get-user-by-uid?uid=${userData.uid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          setCreditsRemaining(response.data.creditsRemaining);
        }).catch(err => {
          console.error('Error fetching user data:', err);
        });
      }
    }
  }, [userData, accessToken]);

  const handleAddQueryField = () => {
    setQueries([...queries, '']);
  };

  const handleQueryChange = (index: number, value: string) => {
    const updated = [...queries];
    updated[index] = value;
    setQueries(updated);
  };

  const handleRequest = async () => {
    if (!accessToken) {
      console.error('No access token found. User may not be logged in.');
      return;
    }

    const filteredQueries = queries.map(q => q.trim()).filter(q => q.length > 0);
    if (filteredQueries.length === 0) {
      console.error('No keywords provided.');
      return;
    }

    const emailCount = targetEmailCount === '' ? 10 : targetEmailCount;
    if (typeof emailCount === 'number' && (emailCount < 1 || emailCount > 50)) {
      console.error('Email count must be between 1 and 50.');
      return;
    }

    if (creditsRemaining !== null && emailCount > creditsRemaining) {
      console.error('Not enough credits on frontend check.');
      return;
    }

    setLoading(true);
    try {
      const userQueriesInput = filteredQueries.join(',');
      const response = await axios.post(
        `${API_BASE_URL}/email-find`,
        {
          baseQuery: `site:${platform}.com/`,
          userQueriesInput: userQueriesInput,
          targetEmailCount: emailCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setEmails(response.data.results || []);
      
      // After successful fetch, we need to update creditsRemaining locally
      // We know how many emails we got:
      const emailsFound = response.data.results?.length || 0;
      if (creditsRemaining !== null && emailsFound > 0) {
        setCreditsRemaining(creditsRemaining - emailsFound);
      }

    } catch (error: any) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (emails.length === 0) return;

    const headers = ['Name', 'Link', 'Emails'];
    const rows = emails.map(item => {
      const emailStr = Array.isArray(item.emails) ? item.emails.join(';') : '';
      return [item.name, item.link, emailStr];
    });

    const csvContent =
      [headers, ...rows].map(e => e.map(value => `"${value || ''}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', `${platform}-emails.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleCopyEmails = async () => {
    if (emails.length === 0) return;

    const allEmails = emails
      .flatMap(item => (Array.isArray(item.emails) ? item.emails : []))
      .join(', ');

    try {
      await navigator.clipboard.writeText(allEmails);
      console.log('Emails copied to clipboard.');
    } catch (err) {
      console.error('Failed to copy emails:', err);
    }
  };

  // Determine if fetch button should be disabled:
  const emailCount = targetEmailCount === '' ? 10 : targetEmailCount;
  const disableFetch =
    loading ||
    !accessToken ||
    queries.every(q => q.trim() === '') ||
    (typeof emailCount === 'number' && (emailCount < 1 || emailCount > 50)) ||
    (creditsRemaining !== null && typeof emailCount === 'number' && emailCount > creditsRemaining);

  return (
    <div className="w-screen min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Find {platform} Emails
        </h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <div className="space-y-2">
                {queries.map((query, index) => (
                  <Input
                    key={index}
                    value={query}
                    onChange={(e) => handleQueryChange(index, e.target.value)}
                    placeholder={`Keyword ${index + 1}`}
                    autoComplete="off"
                  />
                ))}
              </div>
              <Button variant="outline" className="mt-2" onClick={handleAddQueryField}>
                + Add Another Keyword
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Email Count (1 - 50)
              </label>
              <Input
                type="number"
                value={targetEmailCount}
                onChange={(e) => setTargetEmailCount(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 10"
                autoComplete="off"
                min={1}
                max={50}
              />
            </div>
            {creditsRemaining !== null && typeof emailCount === 'number' && emailCount > creditsRemaining && (
              <div className="text-red-600 text-sm">Not enough credits to request {emailCount} emails.</div>
            )}
            <Button onClick={handleRequest} disabled={disableFetch}>
              {loading ? 'Loading...' : 'Fetch Emails'}
            </Button>
          </CardContent>
        </Card>

        {emails.length > 0 && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Results</CardTitle>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleCopyEmails}>Copy Emails</Button>
                <Button variant="outline" onClick={handleDownloadCSV}>Download CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Emails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {item.link}
                        </a>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(item.emails) && item.emails.length > 0
                          ? item.emails.join(', ')
                          : 'No emails found'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlatformEmails;
