# testBloglist.ps1
# A comprehensive test script for bloglist backend API

# Helper: Generate unique username each run to avoid duplicates
function New-RandomUsername {
    return "testuser" + ([guid]::NewGuid().ToString().Substring(0, 8))
}

$baseUrl = "http://localhost:3001/api"

$username = New-RandomUsername
$password = "securePass123"
$name = "Test User"

Write-Output "=== Starting tests with user: $username ==="

# 5.1: GET /api/blogs - Expect 200 and JSON list
try {
    $response = Invoke-RestMethod -Method Get -Uri "$baseUrl/blogs"
    if (-not $response) { throw "Empty response" }
    Write-Output "5.1 Passed: GET blogs successful.`n"
} catch {
    Write-Error "5.1 Failed GET blogs: $_"
    exit 1
}

# 5.2: POST /api/users - Create new user
$userBody = @{ username=$username; name=$name; password=$password } | ConvertTo-Json
try {
    $responseUser = Invoke-RestMethod -Method Post -Uri "$baseUrl/users" -ContentType "application/json" -Body $userBody -ErrorAction Stop
    Write-Output "5.2 Passed: User created.`n"
} catch {
    Write-Error "5.2 Failed user creation: $_"
    exit 1
}

# 5.3: POST /api/login - Login with new user
$loginBody = @{ username=$username; password=$password } | ConvertTo-Json
try {
    $responseLogin = Invoke-RestMethod -Method Post -Uri "$baseUrl/login" -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    $token = $responseLogin.token
    if (-not $token) { throw "Token missing in response" }
    Write-Output "5.3 Passed: Logged in, token acquired.`n"
} catch {
    Write-Error "5.3 Failed login: $_"
    exit 1
}

# 5.4: POST /api/blogs - Create a new blog
$blogBody = @{
    title = "PowerShell Test Blog"
    author = "PS Tester"
    url = "http://psblog.test"
    likes = 0
} | ConvertTo-Json

try {
    $responseCreateBlog = Invoke-RestMethod -Method Post -Uri "$baseUrl/blogs" `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -Body $blogBody -ErrorAction Stop

    Write-Output "DEBUG: Blog creation response:`n$responseCreateBlog | ConvertTo-Json -Depth 5"

    $blogId = $responseCreateBlog._id

    if (-not $blogId) {
        Write-Error "5.4 Failed: Created blog response missing 'id'. Response: $($responseCreateBlog | ConvertTo-Json -Depth 5)"
        exit 1
    }

    Write-Output "5.4 Passed: Blog created with ID $blogId.`n"

} catch {
    Write-Error "5.4 Failed blog creation: $_"
    exit 1
}

# 5.5: PUT /api/blogs/:id - Update blog likes (+1)
$updateBody = @{ likes = $responseCreateBlog.likes + 1 } | ConvertTo-Json
try {
    $responseUpdate = Invoke-RestMethod -Method Put -Uri "$baseUrl/blogs/$blogId" `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -Body $updateBody -ErrorAction Stop
    Write-Output "5.5 Passed: Blog likes updated to $($responseUpdate.likes).`n"
} catch {
    Write-Error "5.5 Failed blog update: $_"
    exit 1
}

# 5.6: DELETE /api/blogs/:id - Delete the blog
try {
    $responseDelete = Invoke-RestMethod -Method Delete -Uri "$baseUrl/blogs/$blogId" `
        -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
    # If no exception, assume success (usually 204 No Content)
    Write-Output "5.6 Passed: Blog deleted successfully.`n"
} catch {
    Write-Error "5.6 Failed to delete blog: $_"
    exit 1
}

# 5.7: GET /api/users - Should return array of users
try {
    $responseUsers = Invoke-RestMethod -Method Get -Uri "$baseUrl/users"
    Write-Output "5.7 Passed: Retrieved users.`n"
} catch {
    Write-Error "5.7 Failed to get users: $_"
    exit 1
}

# 5.8: GET /api/users/:id - Get user details
$userList = $responseUsers
$userId = ($userList | Where-Object { $_.username -eq $username }).id
if (-not $userId) {
    Write-Error "5.8 User ID not found"
    exit 1
}
try {
    $responseUserById = Invoke-RestMethod -Method Get -Uri "$baseUrl/users/$userId"
    Write-Output "5.8 Passed: User details retrieved.`n"
} catch {
    Write-Error "5.8 Failed to get user by ID: $_"
    exit 1
}

# 5.9: POST /api/users - Fail if password too short (<3)
$shortPassBody = @{ username=New-RandomUsername; name="ShortPass"; password="12" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/users" -ContentType "application/json" -Body $shortPassBody -ErrorAction Stop
    Write-Error "5.9 Failed: Short password accepted"
    exit 1
} catch {
    # Expect failure with 400
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Output "5.9 Passed: Short password rejected.`n"
    } else {
        Write-Error "5.9 Failed with unexpected error: $_"
        exit 1
    }
}

# 5.10: POST /api/users - Fail if username too short (<3)
$shortUserBody = @{ username="ab"; name="ShortUser"; password="validPass123" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/users" -ContentType "application/json" -Body $shortUserBody -ErrorAction Stop
    Write-Error "5.10 Failed: Short username accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Output "5.10 Passed: Short username rejected.`n"
    } else {
        Write-Error "5.10 Failed with unexpected error: $_"
        exit 1
    }
}

# 5.11: POST /api/blogs - Fail if no token given
$blogNoTokenBody = @{ title="No Token Blog"; author="Anon"; url="http://notoken.blog" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/blogs" -ContentType "application/json" -Body $blogNoTokenBody -ErrorAction Stop
    Write-Error "5.11 Failed: Blog created without token"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
        Write-Output "5.11 Passed: Blog creation without token rejected.`n"
    } else {
        Write-Error "5.11 Failed with unexpected error: $_"
        exit 1
    }
}

# 5.12: POST /api/blogs - 'likes' missing defaults to 0
$blogNoLikesBody = @{ title="No Likes Blog"; author="NoLikes"; url="http://nolikes.blog" } | ConvertTo-Json
try {
    $responseNoLikes = Invoke-RestMethod -Method Post -Uri "$baseUrl/blogs" `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -Body $blogNoLikesBody -ErrorAction Stop
    if ($responseNoLikes.likes -ne 0) { throw "Likes default not zero" }
    Write-Output "5.12 Passed: Blog without likes created, defaulted to 0.`n"
} catch {
    Write-Error "5.12 Failed blog creation without likes: $_"
    exit 1
}

# 5.13: POST /api/blogs - Fail if title or url missing
$blogMissingTitle = @{ author="NoTitle"; url="http://notitle.blog" } | ConvertTo-Json
$blogMissingUrl = @{ title="No URL Blog"; author="NoUrl" } | ConvertTo-Json

$failedTitle = $false
$failedUrl = $false

try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/blogs" -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } -Body $blogMissingTitle -ErrorAction Stop
    Write-Error "5.13 Failed: Missing title accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        $failedTitle = $true
    } else {
        Write-Error "5.13 Failed with unexpected error on missing title: $_"
        exit 1
    }
}

try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/blogs" -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } -Body $blogMissingUrl -ErrorAction Stop
    Write-Error "5.13 Failed: Missing url accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        $failedUrl = $true
    } else {
        Write-Error "5.13 Failed with unexpected error on missing url: $_"
        exit 1
    }
}

if ($failedTitle -and $failedUrl) {
    Write-Output "5.13 Passed: Blog creation without title/url rejected.`n"
} else {
    Write-Error "5.13 Failed: Missing title/url accepted"
    exit 1
}

# 5.14: PUT /api/blogs/:id - increment likes by 1 for noLikes blog
$blogNoLikesId = $responseNoLikes._id
$updateLikesBody = @{ likes = 1 } | ConvertTo-Json
try {
    $responseIncrementLikes = Invoke-RestMethod -Method Put -Uri "$baseUrl/blogs/$blogNoLikesId" `
        -ContentType "application/json" `
        -Headers @{ Authorization = "Bearer $token" } `
        -Body $updateLikesBody -ErrorAction Stop
    Write-Output "5.14 Passed: Likes incremented successfully.`n"
} catch {
    Write-Error "5.14 Failed to update likes: $_"
    exit 1
}

# 5.15: GET /api/blogs - verify blogs sorted by likes descending
$responseBlogs = Invoke-RestMethod -Method Get -Uri "$baseUrl/blogs" -ErrorAction Stop

$blogsList = $responseBlogs

# Extract likes
$likesArray = $blogsList | ForEach-Object { $_.likes }

# Check descending order
$isSortedDesc = $true
for ($i=0; $i -lt $likesArray.Length - 1; $i++) {
    if ($likesArray[$i] -lt $likesArray[$i + 1]) {
        $isSortedDesc = $false
        break
    }
}

if ($isSortedDesc) {
    Write-Output "5.15 Passed: Blogs sorted by likes descending.`n"
} else {
    Write-Error "5.15 Failed: Blogs not sorted by likes descending"
    exit 1
}

# 5.16: POST /api/users - Fail creating user with duplicate username
$dupUserBody = @{ username=$username; name="DupUser"; password="somePass123" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/users" -ContentType "application/json" -Body $dupUserBody -ErrorAction Stop
    Write-Error "5.16 Failed: Duplicate username accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Output "5.16 Passed: Duplicate username rejected.`n"
    } else {
        Write-Error "5.16 Failed with unexpected error: $_"
        exit 1
    }
}

# 5.17: POST /api/login - Fail login with wrong password
$wrongLoginBody = @{ username=$username; password="wrongPass" } | ConvertTo-Json
try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/login" -ContentType "application/json" -Body $wrongLoginBody -ErrorAction Stop
    Write-Error "5.17 Failed: Wrong password login accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
        Write-Output "5.17 Passed: Wrong password login rejected.`n"
    } else {
        Write-Error "5.17 Failed with unexpected error: $_"
        exit 1
    }
}

# 5.18: POST /api/users - reject duplicate username
$duplicateUserBody = @{
    username = $username  # The same username as the created user
    name     = "Duplicate User"
    password = "anotherPassword123"
} | ConvertTo-Json

Write-Output "Debug: POST $baseUrl/users with duplicate username"
Write-Output $duplicateUserBody

try {
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/users" -ContentType "application/json" -Body $duplicateUserBody -ErrorAction Stop
    Write-Error "5.18 Failed: Duplicate username was accepted"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Output "5.18 Passed: Duplicate username rejected."
    } else {
        Write-Error "5.18 Failed: Unexpected error $_"
        exit 1
    }
}

# 5.19: POST /api/login with wrong password -> reject login
$wrongLoginBody = @{
    username = $username
    password = "WrongPassword123!"
} | ConvertTo-Json

Write-Output "Debug: POST $baseUrl/login with wrong password"
Write-Output $wrongLoginBody

try {
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/login" -ContentType "application/json" -Body $wrongLoginBody -ErrorAction Stop
    Write-Error "5.19 Failed: Login succeeded with wrong password"
    exit 1
} catch {
    # The expected failure is a 401 Unauthorized
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401) {
        Write-Output "5.19 Passed: Wrong password login rejected."
    } else {
        Write-Error "5.19 Failed: Unexpected error $_"
        exit 1
    }
}

# 5.20: GET /api/users - retrieve all users
try {
    Write-Output "Debug: GET $baseUrl/users"
    $response = Invoke-RestMethod -Method Get -Uri "$baseUrl/users" -ContentType "application/json" -ErrorAction Stop

    if ($response -and $response.Count -ge 1) {
        Write-Output "5.20 Passed: Users retrieved."
        # Optionally print some users
        $response | ForEach-Object { Write-Output "$($_.username) `t $($_.name) `t $($_.blogs -join ', ')" }
    }
    else {
        Write-Error "5.20 Failed: No users found."
        exit 1
    }
} catch {
    Write-Error "5.20 Failed: Unexpected error $_"
    exit 1
}

# 5.21: GET /api/users/{id} - retrieve user details by id
try {
    # Pick a valid user ID from previous user list, e.g. the first user
    $usersResponse = Invoke-RestMethod -Method Get -Uri "$baseUrl/users" -ContentType "application/json" -ErrorAction Stop
    if ($usersResponse.Count -eq 0) {
        Write-Error "5.21 Failed: No users to test with."
        exit 1
    }
    $userId = $usersResponse[0].id

    Write-Output "Debug: GET $baseUrl/users/$userId"
    $userDetailResponse = Invoke-RestMethod -Method Get -Uri "$baseUrl/users/$userId" -ContentType "application/json" -ErrorAction Stop

    if ($userDetailResponse.username) {
        Write-Output "5.21 Passed: User details retrieved for $($userDetailResponse.username)."
    }
    else {
        Write-Error "5.21 Failed: User details missing username."
        exit 1
    }
} catch {
    Write-Error "5.21 Failed: Unexpected error $_"
    exit 1
}

# 5.22: Update user name by ID
try {
    $usersResponse = Invoke-RestMethod -Method Get -Uri "$baseUrl/users" -ContentType "application/json" -ErrorAction Stop
    $userToUpdate = $usersResponse | Where-Object { $_.username -eq $username }

    if (-not $userToUpdate) {
        Write-Error "5.22 Failed: Could not find user $username to update."
        exit 1
    }

    $updateBody = @{ name = "Updated Test User" } | ConvertTo-Json

    $updateResponse = Invoke-RestMethod -Method Put -Uri "$baseUrl/users/$($userToUpdate.id)" `
        -Body $updateBody `
        -ContentType "application/json" `
        -ErrorAction Stop

    if ($updateResponse.name -eq "Updated Test User") {
        Write-Output "5.22 Passed: User name updated."
    } else {
        Write-Error "5.22 Failed: User name not updated correctly."
        exit 1
    }
} catch {
    Write-Error "5.22 Failed: Unexpected error $_"
    exit 1
}

# 5.23: Username too short rejected during user creation
Write-Output "Running test 5.23: Username too short rejected"

try {
    $shortUsernameBody = @{
        username = "ab"
        name = "Short Username"
        password = "validpassword"
    } | ConvertTo-Json

    $endpoint = "$baseUrl/users"
    Write-Host "POST to: $endpoint"
    Write-Host "Payload: $shortUsernameBody"

    Invoke-RestMethod -Method Post -Uri $endpoint -ContentType "application/json" -Body $shortUsernameBody -ErrorAction Stop

    Write-Error "5.23 Failed: Short username user was created"
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Output "5.23 Passed: Short username rejected."
    } else {
        Write-Error "5.23 Failed: Unexpected error: $($_.Exception.Message)"
        exit 1
    }
}

# Finished all tests
Write-Output "=== All tests passed successfully! ==="
